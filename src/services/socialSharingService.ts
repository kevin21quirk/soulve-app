
export interface SocialShareData {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  hashtags?: string[];
  via?: string;
}

export interface CampaignShareData extends SocialShareData {
  campaignId: string;
  goalAmount?: number;
  currentAmount?: number;
  category: string;
  organizer: string;
  urgency?: string;
}

export class SocialSharingService {
  private static generateShareUrl(platform: string, data: SocialShareData): string {
    const encodedUrl = encodeURIComponent(data.url);
    const encodedTitle = encodeURIComponent(data.title);
    const encodedDescription = encodeURIComponent(data.description);
    const hashtags = data.hashtags?.join(',') || '';

    switch (platform) {
      case 'twitter':
        const twitterText = `${data.title} - ${data.description}`;
        const twitterHashtags = data.hashtags?.map(tag => `#${tag}`).join(' ') || '';
        const via = data.via ? `&via=${data.via}` : '';
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText + ' ' + twitterHashtags)}&url=${encodedUrl}${via}`;
      
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`;
      
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`;
      
      case 'whatsapp':
        const whatsappText = `${data.title}\n${data.description}\n${data.url}`;
        return `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
      
      case 'telegram':
        const telegramText = `${data.title}\n${data.description}`;
        return `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(telegramText)}`;
      
      case 'reddit':
        return `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
      
      case 'email':
        const subject = encodeURIComponent(`Check out: ${data.title}`);
        const body = encodeURIComponent(`${data.title}\n\n${data.description}\n\n${data.url}`);
        return `mailto:?subject=${subject}&body=${body}`;
      
      default:
        return data.url;
    }
  }

  static shareToPlatform(platform: string, data: SocialShareData): void {
    const shareUrl = this.generateShareUrl(platform, data);
    
    if (platform === 'email') {
      window.location.href = shareUrl;
    } else {
      window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
    }
  }

  static async copyToClipboard(data: SocialShareData): Promise<boolean> {
    try {
      const shareText = `${data.title}\n${data.description}\n${data.url}`;
      await navigator.clipboard.writeText(shareText);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }

  static generateCampaignShareData(campaign: any, baseUrl: string = window.location.origin): CampaignShareData {
    const campaignUrl = `${baseUrl}/campaign/${campaign.id}`;
    const progress = campaign.goal_amount && campaign.current_amount 
      ? Math.round((campaign.current_amount / campaign.goal_amount) * 100)
      : 0;

    return {
      campaignId: campaign.id,
      title: campaign.title,
      description: `${campaign.description} - ${progress}% funded! Help us reach our goal.`,
      url: campaignUrl,
      imageUrl: campaign.featured_image,
      hashtags: ['SoulveCampaign', campaign.category.replace('_', ''), 'MakeADifference'],
      via: 'SoulvePlatform',
      goalAmount: campaign.goal_amount,
      currentAmount: campaign.current_amount,
      category: campaign.category,
      organizer: campaign.creator_id,
      urgency: campaign.urgency
    };
  }

  static generateCustomPreviewCard(data: CampaignShareData): string {
    return `
      <div style="
        max-width: 500px; 
        border: 1px solid #e5e7eb; 
        border-radius: 12px; 
        overflow: hidden; 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      ">
        ${data.imageUrl ? `
          <img src="${data.imageUrl}" alt="${data.title}" style="
            width: 100%; 
            height: 200px; 
            object-fit: cover;
          ">
        ` : ''}
        <div style="padding: 20px;">
          <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #111827;">
            ${data.title}
          </h3>
          <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
            ${data.description}
          </p>
          ${data.goalAmount ? `
            <div style="margin: 12px 0;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="font-size: 12px; color: #6b7280;">Progress</span>
                <span style="font-size: 12px; font-weight: 600; color: #059669;">
                  $${(data.currentAmount || 0).toLocaleString()} / $${data.goalAmount.toLocaleString()}
                </span>
              </div>
              <div style="background: #f3f4f6; height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="
                  background: linear-gradient(to right, #0ce4af, #18a5fe); 
                  height: 100%; 
                  width: ${Math.min(((data.currentAmount || 0) / data.goalAmount) * 100, 100)}%;
                  transition: width 0.3s ease;
                "></div>
              </div>
            </div>
          ` : ''}
          <div style="display: flex; align-items: center; gap: 8px; margin-top: 12px;">
            <span style="
              background: #f0f9ff; 
              color: #0369a1; 
              padding: 4px 8px; 
              border-radius: 6px; 
              font-size: 12px; 
              font-weight: 500;
            ">
              ${data.category.replace('_', ' ').toUpperCase()}
            </span>
            <span style="color: #6b7280; font-size: 12px;">
              by ${data.organizer}
            </span>
          </div>
        </div>
      </div>
    `;
  }
}
