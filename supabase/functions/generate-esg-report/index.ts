import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const {
      organizationId,
      reportName,
      reportType,
      frameworkVersion,
      reportingPeriodStart,
      reportingPeriodEnd,
      selectedSections,
      executiveSummary
    } = await req.json();

    console.log('Generating ESG report:', { organizationId, reportType, reportName });

    // Create report record with 'draft' status
    const { data: report, error: reportError } = await supabaseClient
      .from('esg_reports')
      .insert({
        organization_id: organizationId,
        report_name: reportName,
        report_type: reportType,
        framework_version: frameworkVersion,
        reporting_period_start: reportingPeriodStart,
        reporting_period_end: reportingPeriodEnd,
        status: 'draft',
        executive_summary: executiveSummary,
        template_data: { selected_sections: selectedSections },
        created_by: user.id,
        report_format: 'html'
      })
      .select()
      .single();

    if (reportError) {
      console.error('Error creating report:', reportError);
      throw reportError;
    }

    console.log('Report record created:', report.id);

    // Fetch all ESG data for the organization
    const { data: esgData, error: dataError } = await supabaseClient
      .from('organization_esg_data')
      .select(`
        *,
        indicator:esg_indicators(
          indicator_code,
          name,
          category,
          subcategory
        )
      `)
      .eq('organization_id', organizationId)
      .gte('reporting_period', reportingPeriodStart)
      .lte('reporting_period', reportingPeriodEnd);

    if (dataError) {
      console.error('Error fetching ESG data:', dataError);
      throw dataError;
    }

    console.log(`Fetched ${esgData?.length || 0} ESG data points`);

    // Fetch stakeholder contributions
    const { data: contributions, error: contribError } = await supabaseClient
      .from('stakeholder_data_contributions')
      .select(`
        *,
        contributor_org:organizations!stakeholder_data_contributions_contributor_org_id_fkey(name)
      `)
      .eq('contribution_status', 'submitted')
      .eq('verification_status', 'verified');

    if (contribError) {
      console.error('Error fetching contributions:', contribError);
    }

    console.log(`Fetched ${contributions?.length || 0} stakeholder contributions`);

    // Fetch SDG indicators (UN SDG framework)
    const { data: sdgIndicators, error: sdgError } = await supabaseClient
      .from('esg_indicators')
      .select('*')
      .eq('framework_id', '510dd185-ef4b-47d6-8b95-efb8193dacb3') // UN_SDG framework ID
      .order('indicator_code');

    if (sdgError) {
      console.error('Error fetching SDG indicators:', sdgError);
    }

    console.log(`Fetched ${sdgIndicators?.length || 0} SDG indicators`);

    // Match organization data to SDG goals
    const sdgAlignment = sdgIndicators?.map(sdg => {
      const matchingData = esgData?.filter(d => 
        d.indicator?.name?.toLowerCase().includes(sdg.name?.toLowerCase().split(' ')[0]) ||
        d.indicator?.subcategory === sdg.subcategory
      );
      return {
        ...sdg,
        dataPoints: matchingData?.length || 0,
        aligned: (matchingData?.length || 0) > 0
      };
    }) || [];

    // Group data by category
    const categorizedData = {
      environmental: esgData?.filter((d: any) => d.indicator?.category === 'environmental') || [],
      social: esgData?.filter((d: any) => d.indicator?.category === 'social') || [],
      governance: esgData?.filter((d: any) => d.indicator?.category === 'governance') || []
    };

    // Generate report content
    const reportContent = generateReportHTML({
      reportName,
      reportType,
      executiveSummary,
      reportingPeriod: `${reportingPeriodStart} to ${reportingPeriodEnd}`,
      categorizedData,
      contributions,
      sdgAlignment
    });

    // Upload HTML to storage
    const htmlFileName = `${organizationId}/${report.id}.html`;
    const htmlBlob = new Blob([reportContent], { type: 'text/html' });
    
    const { error: htmlUploadError } = await supabaseClient.storage
      .from('esg-reports')
      .upload(htmlFileName, htmlBlob, {
        contentType: 'text/html',
        upsert: true
      });

    if (htmlUploadError) {
      console.error('Error uploading HTML:', htmlUploadError);
      throw htmlUploadError;
    }

    // Generate signed URL (1 year expiry) for secure access
    const { data: signedUrlData, error: signedUrlError } = await supabaseClient.storage
      .from('esg-reports')
      .createSignedUrl(htmlFileName, 31536000); // 1 year in seconds

    if (signedUrlError) {
      console.error('Error creating signed URL:', signedUrlError);
      throw signedUrlError;
    }

    const htmlUrl = signedUrlData.signedUrl;
    console.log('✅ HTML uploaded to storage with signed URL');

    // Update report with generated content and URLs
    const { error: updateError } = await supabaseClient
      .from('esg_reports')
      .update({
        generated_content: reportContent,
        html_url: htmlUrl,
        file_size_bytes: new Blob([reportContent]).size,
        status: 'approved'
      })
      .eq('id', report.id);

    if (updateError) {
      console.error('Error updating report:', updateError);
      throw updateError;
    }

    console.log('✅ ESG report generated successfully');

    return new Response(
      JSON.stringify({
        success: true,
        reportId: report.id,
        htmlUrl,
        message: 'ESG report generated successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in generate-esg-report:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateReportHTML(data: any): string {
  const { reportName, reportType, executiveSummary, reportingPeriod, categorizedData, contributions, sdgAlignment } = data;

  const contributionsList = contributions?.map((c: any) => 
    `<li>${c.contributor_org?.name || 'Unknown'}</li>`
  ).join('') || '';

  const alignedSDGs = sdgAlignment?.filter((sdg: any) => sdg.aligned) || [];
  const sdgSection = alignedSDGs.length > 0 ? `
    <div class="category">
      <h2>UN Sustainable Development Goals Alignment</h2>
      <p>This report aligns with <strong>${alignedSDGs.length}</strong> UN Sustainable Development Goals:</p>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
        ${alignedSDGs.map((sdg: any) => `
          <div style="background: linear-gradient(135deg, #0ce4af 0%, #18a5fe 100%); color: white; padding: 15px; border-radius: 8px;">
            <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px;">SDG ${sdg.indicator_code}</div>
            <div style="font-size: 14px;">${sdg.name}</div>
            <div style="font-size: 12px; margin-top: 5px; opacity: 0.9;">${sdg.dataPoints} data points</div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${reportName}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #0ce4af; border-bottom: 3px solid #18a5fe; }
        h2 { color: #18a5fe; margin-top: 30px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f4f4f4; font-weight: bold; }
        .summary { background: #f9f9f9; padding: 20px; border-left: 4px solid #0ce4af; margin: 20px 0; }
        .category { margin: 30px 0; }
        .contributors { background: #e8f5e9; padding: 15px; border-radius: 5px; }
      </style>
    </head>
    <body>
      <h1>${reportName}</h1>
      <p><strong>Report Type:</strong> ${reportType.toUpperCase()}</p>
      <p><strong>Reporting Period:</strong> ${reportingPeriod}</p>

      <div class="summary">
        <h2>Executive Summary</h2>
        <p>${executiveSummary || 'No executive summary provided.'}</p>
      </div>

      ${sdgSection}

      <div class="category">
        <h2>Environmental Performance</h2>
        <p><strong>Data Points:</strong> ${categorizedData.environmental.length}</p>
        ${categorizedData.environmental.length > 0 ? `
          <table>
            <tr><th>Indicator</th><th>Value</th><th>Unit</th><th>Period</th></tr>
            ${categorizedData.environmental.slice(0, 10).map((d: any) => `
              <tr>
                <td>${d.indicator?.name || 'N/A'}</td>
                <td>${d.value || d.text_value || 'N/A'}</td>
                <td>${d.unit || 'N/A'}</td>
                <td>${new Date(d.reporting_period).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </table>
        ` : '<p>No environmental data available.</p>'}
      </div>

      <div class="category">
        <h2>Social Performance</h2>
        <p><strong>Data Points:</strong> ${categorizedData.social.length}</p>
        ${categorizedData.social.length > 0 ? `
          <table>
            <tr><th>Indicator</th><th>Value</th><th>Unit</th><th>Period</th></tr>
            ${categorizedData.social.slice(0, 10).map((d: any) => `
              <tr>
                <td>${d.indicator?.name || 'N/A'}</td>
                <td>${d.value || d.text_value || 'N/A'}</td>
                <td>${d.unit || 'N/A'}</td>
                <td>${new Date(d.reporting_period).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </table>
        ` : '<p>No social data available.</p>'}
      </div>

      <div class="category">
        <h2>Governance Performance</h2>
        <p><strong>Data Points:</strong> ${categorizedData.governance.length}</p>
        ${categorizedData.governance.length > 0 ? `
          <table>
            <tr><th>Indicator</th><th>Value</th><th>Unit</th><th>Period</th></tr>
            ${categorizedData.governance.slice(0, 10).map((d: any) => `
              <tr>
                <td>${d.indicator?.name || 'N/A'}</td>
                <td>${d.value || d.text_value || 'N/A'}</td>
                <td>${d.unit || 'N/A'}</td>
                <td>${new Date(d.reporting_period).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </table>
        ` : '<p>No governance data available.</p>'}
      </div>

      ${contributions && contributions.length > 0 ? `
        <div class="contributors">
          <h2>Stakeholder Contributors</h2>
          <p>This report includes data contributed by the following stakeholder organizations:</p>
          <ul>${contributionsList}</ul>
        </div>
      ` : ''}

      <footer style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
        <p>Generated by SouLVE ESG Platform | ${new Date().toLocaleDateString()}</p>
      </footer>
    </body>
    </html>
  `;
}
