import { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
  MiniMap,
  Panel,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload, FileImage, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialNodes: Node[] = [
  // Safeguarding Layer
  {
    id: 'safeguarding-root',
    type: 'input',
    data: { label: '🛡️ Safeguarding System' },
    position: { x: 400, y: 0 },
    style: { background: '#ef4444', color: 'white', fontWeight: 'bold', padding: '10px 20px' },
  },
  {
    id: 'emergency-alerts',
    data: { label: 'Emergency Alerts' },
    position: { x: 100, y: 100 },
    style: { background: '#dc2626', color: 'white' },
  },
  {
    id: 'dbs-checks',
    data: { label: 'DBS Checks' },
    position: { x: 300, y: 100 },
    style: { background: '#dc2626', color: 'white' },
  },
  {
    id: 'keyword-monitoring',
    data: { label: 'Keyword Monitoring' },
    position: { x: 500, y: 100 },
    style: { background: '#dc2626', color: 'white' },
  },
  {
    id: 'active-sessions',
    data: { label: 'Active Sessions' },
    position: { x: 700, y: 100 },
    style: { background: '#dc2626', color: 'white' },
  },

  // User Management Layer
  {
    id: 'user-management',
    data: { label: '👥 User Management' },
    position: { x: 400, y: 220 },
    style: { background: '#3b82f6', color: 'white', fontWeight: 'bold', padding: '10px 20px' },
  },
  {
    id: 'waitlist',
    data: { label: 'Waitlist' },
    position: { x: 100, y: 320 },
    style: { background: '#2563eb', color: 'white' },
  },
  {
    id: 'id-verification',
    data: { label: 'ID Verification' },
    position: { x: 300, y: 320 },
    style: { background: '#2563eb', color: 'white' },
  },
  {
    id: 'user-profiles',
    data: { label: 'User Profiles' },
    position: { x: 500, y: 320 },
    style: { background: '#2563eb', color: 'white' },
  },
  {
    id: 'user-blocks',
    data: { label: 'User Blocks' },
    position: { x: 700, y: 320 },
    style: { background: '#2563eb', color: 'white' },
  },

  // Helper System Layer
  {
    id: 'helper-system',
    data: { label: '🤝 Safe Space Helper System' },
    position: { x: 400, y: 440 },
    style: { background: '#10b981', color: 'white', fontWeight: 'bold', padding: '10px 20px' },
  },
  {
    id: 'helper-verification',
    data: { label: 'Helper Verification' },
    position: { x: 200, y: 540 },
    style: { background: '#059669', color: 'white' },
  },
  {
    id: 'training-management',
    data: { label: 'Training Management' },
    position: { x: 400, y: 540 },
    style: { background: '#059669', color: 'white' },
  },
  {
    id: 'evidence-review',
    data: { label: 'Evidence Review' },
    position: { x: 600, y: 540 },
    style: { background: '#059669', color: 'white' },
  },

  // Content Layer
  {
    id: 'content-system',
    data: { label: '📝 Content & Moderation' },
    position: { x: 400, y: 660 },
    style: { background: '#f59e0b', color: 'white', fontWeight: 'bold', padding: '10px 20px' },
  },
  {
    id: 'posts',
    data: { label: 'Posts' },
    position: { x: 100, y: 760 },
    style: { background: '#d97706', color: 'white' },
  },
  {
    id: 'moderation',
    data: { label: 'Content Moderation' },
    position: { x: 300, y: 760 },
    style: { background: '#d97706', color: 'white' },
  },
  {
    id: 'red-flags',
    data: { label: 'Red Flags' },
    position: { x: 500, y: 760 },
    style: { background: '#d97706', color: 'white' },
  },
  {
    id: 'feedback',
    data: { label: 'Feedback' },
    position: { x: 700, y: 760 },
    style: { background: '#d97706', color: 'white' },
  },

  // Organization & Campaigns Layer
  {
    id: 'org-campaigns',
    data: { label: '🏢 Organizations & Campaigns' },
    position: { x: 400, y: 880 },
    style: { background: '#8b5cf6', color: 'white', fontWeight: 'bold', padding: '10px 20px' },
  },
  {
    id: 'organizations',
    data: { label: 'Organizations' },
    position: { x: 150, y: 980 },
    style: { background: '#7c3aed', color: 'white' },
  },
  {
    id: 'campaigns',
    data: { label: 'Campaigns' },
    position: { x: 350, y: 980 },
    style: { background: '#7c3aed', color: 'white' },
  },
  {
    id: 'donations',
    data: { label: 'Donations' },
    position: { x: 550, y: 980 },
    style: { background: '#7c3aed', color: 'white' },
  },
  {
    id: 'demo-requests',
    data: { label: 'Demo Requests' },
    position: { x: 750, y: 980 },
    style: { background: '#7c3aed', color: 'white' },
  },

  // Gamification & Engagement Layer
  {
    id: 'gamification',
    data: { label: '🎮 Gamification & Engagement' },
    position: { x: 400, y: 1100 },
    style: { background: '#ec4899', color: 'white', fontWeight: 'bold', padding: '10px 20px' },
  },
  {
    id: 'badges',
    data: { label: 'Badge Management' },
    position: { x: 200, y: 1200 },
    style: { background: '#db2777', color: 'white' },
  },
  {
    id: 'points',
    data: { label: 'Points Config' },
    position: { x: 400, y: 1200 },
    style: { background: '#db2777', color: 'white' },
  },
  {
    id: 'subscriptions',
    data: { label: 'Subscriptions' },
    position: { x: 600, y: 1200 },
    style: { background: '#db2777', color: 'white' },
  },

  // System & Analytics Layer
  {
    id: 'system-analytics',
    data: { label: '📊 System & Analytics' },
    position: { x: 400, y: 1320 },
    style: { background: '#06b6d4', color: 'white', fontWeight: 'bold', padding: '10px 20px' },
  },
  {
    id: 'analytics',
    data: { label: 'Analytics Dashboard' },
    position: { x: 200, y: 1420 },
    style: { background: '#0891b2', color: 'white' },
  },
  {
    id: 'system-health',
    data: { label: 'System Health' },
    position: { x: 400, y: 1420 },
    style: { background: '#0891b2', color: 'white' },
  },
  {
    id: 'blog',
    data: { label: 'Blog Management' },
    position: { x: 600, y: 1420 },
    style: { background: '#0891b2', color: 'white' },
  },
];

const initialEdges: Edge[] = [
  // Safeguarding connections
  { id: 'e-sg-1', source: 'safeguarding-root', target: 'emergency-alerts', animated: true },
  { id: 'e-sg-2', source: 'safeguarding-root', target: 'dbs-checks', animated: true },
  { id: 'e-sg-3', source: 'safeguarding-root', target: 'keyword-monitoring', animated: true },
  { id: 'e-sg-4', source: 'safeguarding-root', target: 'active-sessions', animated: true },
  
  // User management connections
  { id: 'e-um-1', source: 'user-management', target: 'waitlist' },
  { id: 'e-um-2', source: 'user-management', target: 'id-verification' },
  { id: 'e-um-3', source: 'user-management', target: 'user-profiles' },
  { id: 'e-um-4', source: 'user-management', target: 'user-blocks' },
  
  // Helper system connections
  { id: 'e-hs-1', source: 'helper-system', target: 'helper-verification' },
  { id: 'e-hs-2', source: 'helper-system', target: 'training-management' },
  { id: 'e-hs-3', source: 'helper-system', target: 'evidence-review' },
  
  // Content connections
  { id: 'e-cs-1', source: 'content-system', target: 'posts' },
  { id: 'e-cs-2', source: 'content-system', target: 'moderation' },
  { id: 'e-cs-3', source: 'content-system', target: 'red-flags' },
  { id: 'e-cs-4', source: 'content-system', target: 'feedback' },
  
  // Organization connections
  { id: 'e-oc-1', source: 'org-campaigns', target: 'organizations' },
  { id: 'e-oc-2', source: 'org-campaigns', target: 'campaigns' },
  { id: 'e-oc-3', source: 'org-campaigns', target: 'donations' },
  { id: 'e-oc-4', source: 'org-campaigns', target: 'demo-requests' },
  
  // Gamification connections
  { id: 'e-gm-1', source: 'gamification', target: 'badges' },
  { id: 'e-gm-2', source: 'gamification', target: 'points' },
  { id: 'e-gm-3', source: 'gamification', target: 'subscriptions' },
  
  // System connections
  { id: 'e-sa-1', source: 'system-analytics', target: 'analytics' },
  { id: 'e-sa-2', source: 'system-analytics', target: 'system-health' },
  { id: 'e-sa-3', source: 'system-analytics', target: 'blog' },
  
  // Cross-layer connections
  { id: 'e-cross-1', source: 'safeguarding-root', target: 'user-management', type: 'step' },
  { id: 'e-cross-2', source: 'user-management', target: 'helper-system', type: 'step' },
  { id: 'e-cross-3', source: 'helper-system', target: 'content-system', type: 'step' },
  { id: 'e-cross-4', source: 'content-system', target: 'org-campaigns', type: 'step' },
  { id: 'e-cross-5', source: 'org-campaigns', target: 'gamification', type: 'step' },
  { id: 'e-cross-6', source: 'gamification', target: 'system-analytics', type: 'step' },
];

// Component documentation mapping
const componentDocs: Record<string, { title: string; description: string; route?: string; features: string[] }> = {
  'emergency-alerts': {
    title: 'Emergency Alerts',
    description: 'Real-time monitoring and management of emergency safeguarding alerts from users in distress.',
    route: '/admin/safeguarding/alerts',
    features: ['24/7 alert monitoring', 'Priority escalation', 'Response tracking', 'Alert history'],
  },
  'dbs-checks': {
    title: 'DBS Checks',
    description: 'Disclosure and Barring Service verification for Safe Space Helpers.',
    route: '/admin/safeguarding/dbs',
    features: ['DBS certificate upload', 'Verification status tracking', 'Expiry notifications', 'Compliance reporting'],
  },
  'keyword-monitoring': {
    title: 'Keyword Monitoring',
    description: 'Automated detection of concerning keywords in user communications.',
    route: '/admin/safeguarding/keywords',
    features: ['Custom keyword lists', 'Real-time scanning', 'Alert generation', 'False positive management'],
  },
  'active-sessions': {
    title: 'Active Sessions',
    description: 'Live monitoring of Safe Space Helper sessions with users.',
    route: '/admin/safeguarding/sessions',
    features: ['Session tracking', 'Duration monitoring', 'Helper availability', 'Session notes'],
  },
  'waitlist': {
    title: 'Waitlist Management',
    description: 'Review and approve users waiting to join the platform.',
    route: '/admin/waitlist',
    features: ['Application review', 'Approval workflow', 'Rejection reasons', 'Bulk actions'],
  },
  'id-verification': {
    title: 'ID Verification',
    description: 'Identity verification for users and organizations.',
    route: '/admin/id-verifications',
    features: ['Document upload', 'Manual review', 'Automated checks', 'Verification badges'],
  },
  'user-profiles': {
    title: 'User Profiles',
    description: 'Comprehensive user management and profile administration.',
    route: '/admin/users',
    features: ['Profile editing', 'Role management', 'Activity history', 'Account suspension'],
  },
  'user-blocks': {
    title: 'User Blocks',
    description: 'Manage blocked users and blocking relationships.',
    route: '/admin/blocks',
    features: ['Block history', 'Unblock requests', 'Pattern analysis', 'Harassment prevention'],
  },
  'helper-verification': {
    title: 'Helper Verification',
    description: 'Verification process for Safe Space Helper applications.',
    route: '/admin/helpers',
    features: ['Application review', 'Background checks', 'Interview scheduling', 'Approval workflow'],
  },
  'training-management': {
    title: 'Training Management',
    description: 'Track and manage Safe Space Helper training progress.',
    route: '/admin/training',
    features: ['Course completion', 'Quiz results', 'Certification', 'Continuing education'],
  },
  'evidence-review': {
    title: 'Evidence Review',
    description: 'Review evidence submissions for campaigns and achievements.',
    route: '/admin/evidence',
    features: ['Photo/video review', 'Verification workflow', 'Rejection feedback', 'Quality control'],
  },
  'posts': {
    title: 'Posts',
    description: 'User-generated content and community posts.',
    features: ['Post visibility', 'Engagement metrics', 'Content filtering', 'Trending analysis'],
  },
  'moderation': {
    title: 'Content Moderation',
    description: 'Review and moderate reported content.',
    route: '/admin/moderation',
    features: ['Report queue', 'Content removal', 'User warnings', 'Appeal system'],
  },
  'red-flags': {
    title: 'Red Flags',
    description: 'Automated detection of concerning user behavior patterns.',
    route: '/admin/red-flags',
    features: ['Behavior analysis', 'Risk scoring', 'Alert triggers', 'Investigation tools'],
  },
  'feedback': {
    title: 'Feedback Management',
    description: 'User feedback and feature requests.',
    route: '/admin/feedback',
    features: ['Feedback categorization', 'Priority assignment', 'Response tracking', 'Trend analysis'],
  },
  'organizations': {
    title: 'Organizations',
    description: 'Manage registered organizations and charities.',
    route: '/admin/organizations',
    features: ['Org verification', 'Profile management', 'Member administration', 'Compliance tracking'],
  },
  'campaigns': {
    title: 'Campaign Management',
    description: 'Oversee campaigns and volunteering opportunities.',
    route: '/admin/campaigns',
    features: ['Campaign approval', 'Progress tracking', 'Impact measurement', 'Featured campaigns'],
  },
  'donations': {
    title: 'Donation Management',
    description: 'Track and manage platform donations.',
    route: '/admin/donations',
    features: ['Transaction history', 'Refund processing', 'Tax receipts', 'Donation analytics'],
  },
  'demo-requests': {
    title: 'Demo Requests',
    description: 'Manage demo booking requests from organizations.',
    route: '/admin/demo-requests',
    features: ['Booking calendar', 'Request approval', 'Follow-up tracking', 'Demo feedback'],
  },
  'badges': {
    title: 'Badge Management',
    description: 'Create and manage achievement badges.',
    route: '/admin/badges',
    features: ['Badge creation', 'Criteria definition', 'Icon upload', 'Rarity levels'],
  },
  'points': {
    title: 'Points Configuration',
    description: 'Configure point values for platform actions.',
    route: '/admin/points-config',
    features: ['Action point values', 'Multipliers', 'Seasonal bonuses', 'Point decay rules'],
  },
  'subscriptions': {
    title: 'Subscription Management',
    description: 'Manage user subscriptions and premium features.',
    route: '/admin/subscriptions',
    features: ['Plan management', 'Billing history', 'Upgrade/downgrade', 'Cancellation handling'],
  },
  'analytics': {
    title: 'Analytics Dashboard',
    description: 'Platform-wide analytics and insights.',
    route: '/admin/analytics',
    features: ['User growth', 'Engagement metrics', 'Revenue tracking', 'Custom reports'],
  },
  'system-health': {
    title: 'System Health',
    description: 'Monitor platform performance and health.',
    route: '/admin/system-health',
    features: ['Server status', 'Database performance', 'Error tracking', 'Uptime monitoring'],
  },
  'blog': {
    title: 'Blog Management',
    description: 'Create and manage blog posts and articles.',
    route: '/admin/blog',
    features: ['Post editor', 'SEO optimization', 'Publishing schedule', 'Category management'],
  },
};

const SchematicPanelContent = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const { toast } = useToast();
  const { getNodes } = useReactFlow();

  useEffect(() => {
    console.log('[SELECTED NODE CHANGED]', selectedNode?.id, selectedNode?.data?.label);
    if (selectedNode) {
      console.log('[DOCUMENTATION EXISTS]', !!componentDocs[selectedNode.id]);
    }
  }, [selectedNode]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    console.log('Node clicked:', node);
    console.log('Node ID:', node.id);
    console.log('Has documentation:', !!componentDocs[node.id]);
    setSelectedNode(node);
    
    if (componentDocs[node.id]) {
      toast({
        title: "Node Selected",
        description: `Viewing documentation for: ${componentDocs[node.id].title}`,
      });
    } else {
      toast({
        title: "Node Selected",
        description: `${node.data.label} - Documentation not available for this node`,
        variant: "destructive",
      });
    }
  }, [toast]);

  const exportDiagramJSON = () => {
    const diagramData = {
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(diagramData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'soulve-schematic.json';
    link.click();
    toast({
      title: "Diagram Exported",
      description: "JSON file downloaded successfully",
    });
  };

  const exportDiagramPNG = () => {
    const reactFlowElement = document.querySelector('.react-flow') as HTMLElement;
    if (!reactFlowElement) {
      toast({
        title: "Export Failed",
        description: "Could not find diagram element",
        variant: "destructive",
      });
      return;
    }

    toPng(reactFlowElement, {
      backgroundColor: '#ffffff',
      width: reactFlowElement.offsetWidth,
      height: reactFlowElement.offsetHeight,
      style: {
        width: `${reactFlowElement.offsetWidth}px`,
        height: `${reactFlowElement.offsetHeight}px`,
      },
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'soulve-schematic.png';
        link.href = dataUrl;
        link.click();
        toast({
          title: "PNG Exported",
          description: "Image downloaded successfully",
        });
      })
      .catch((error) => {
        console.error('PNG export error:', error);
        toast({
          title: "Export Failed",
          description: "Could not export diagram as PNG",
          variant: "destructive",
        });
      });
  };

  const exportDiagramPDF = () => {
    const reactFlowElement = document.querySelector('.react-flow') as HTMLElement;
    if (!reactFlowElement) {
      toast({
        title: "Export Failed",
        description: "Could not find diagram element",
        variant: "destructive",
      });
      return;
    }

    toPng(reactFlowElement, {
      backgroundColor: '#ffffff',
      width: reactFlowElement.offsetWidth,
      height: reactFlowElement.offsetHeight,
    })
      .then((dataUrl) => {
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [reactFlowElement.offsetWidth, reactFlowElement.offsetHeight],
        });

        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('soulve-schematic.pdf');
        
        toast({
          title: "PDF Exported",
          description: "PDF downloaded successfully",
        });
      })
      .catch((error) => {
        console.error('PDF export error:', error);
        toast({
          title: "Export Failed",
          description: "Could not export diagram as PDF",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🗺️</span> Application Schematic
          </CardTitle>
          <CardDescription>
            Interactive workflow diagram showing the complete application structure from safeguarding through all components.
            Click and drag nodes to rearrange, or add new connections by dragging from node edges.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4 flex-wrap">
            <Button onClick={exportDiagramJSON} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            <Button onClick={exportDiagramPNG} variant="outline" size="sm">
              <FileImage className="h-4 w-4 mr-2" />
              Export PNG
            </Button>
            <Button onClick={exportDiagramPDF} variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Upload className="h-4 w-4 mr-2" />
              Import Diagram
            </Button>
          </div>
          
          <div className="border rounded-lg overflow-hidden" style={{ height: '800px' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              fitView
              attributionPosition="bottom-left"
            >
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
              <Controls />
              <MiniMap 
                nodeColor={(node) => {
                  const bg = node.style?.background as string;
                  return bg || '#3b82f6';
                }}
                maskColor="rgba(0, 0, 0, 0.1)"
              />
              <Panel position="top-right" className="bg-white p-2 rounded shadow-lg text-sm">
                <div className="space-y-1">
                  <div className="font-semibold">Legend:</div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-600 rounded"></div>
                    <span>Safeguarding</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <span>User Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-600 rounded"></div>
                    <span>Helper System</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-600 rounded"></div>
                    <span>Content</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-600 rounded"></div>
                    <span>Organizations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-pink-600 rounded"></div>
                    <span>Gamification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-cyan-600 rounded"></div>
                    <span>System</span>
                  </div>
                </div>
              </Panel>
            </ReactFlow>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Component Documentation</CardTitle>
          <CardDescription>
            Click on any node in the diagram above to view detailed documentation for that component.
            {selectedNode && <span className="text-xs ml-2">(Selected: {selectedNode.data.label})</span>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedNode && componentDocs[selectedNode.id] ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{componentDocs[selectedNode.id].title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {componentDocs[selectedNode.id].description}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2">Key Features:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-2">
                  {componentDocs[selectedNode.id].features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>

              {componentDocs[selectedNode.id].route && (
                <div className="pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = componentDocs[selectedNode.id].route!}
                  >
                    Go to {componentDocs[selectedNode.id].title} →
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">The schematic shows the complete application workflow organized into layers:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Safeguarding Layer:</strong> Emergency alerts, DBS checks, keyword monitoring, and active session tracking</li>
                <li><strong>User Management:</strong> Waitlist, ID verification, user profiles, and blocking system</li>
                <li><strong>Helper System:</strong> Verification, training management, and evidence review for Safe Space Helpers</li>
                <li><strong>Content & Moderation:</strong> Posts, content moderation, red flags, and user feedback</li>
                <li><strong>Organizations & Campaigns:</strong> Organization management, campaign creation, donations, and demo requests</li>
                <li><strong>Gamification:</strong> Badge management, points configuration, and subscription handling</li>
                <li><strong>System & Analytics:</strong> Analytics dashboard, system health monitoring, and blog management</li>
              </ul>
              <p className="mt-4 text-xs italic">💡 Click on any node in the diagram to view detailed documentation</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const SchematicPanel = () => {
  return (
    <ReactFlowProvider>
      <SchematicPanelContent />
    </ReactFlowProvider>
  );
};

export default SchematicPanel;
