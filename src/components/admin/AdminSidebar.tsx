import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Shield, 
  ClipboardList, 
  FileCheck, 
  Settings,
  Award,
  AlertTriangle,
  HeartHandshake,
  Sliders,
  ArrowLeft,
  MessageSquare,
  ShieldAlert,
  Eye,
  FileText,
  AlertCircle
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NotificationBadge } from '@/components/ui/notification-badge';
import { useNotificationCounts } from '@/hooks/useNotificationCounts';

const adminNavItems = [
  { title: 'Overview', url: '/admin', icon: LayoutDashboard, exact: true, showBadge: false },
  { title: 'User Management', url: '/admin/users', icon: Users, showBadge: false },
  { title: 'Waitlist', url: '/admin/waitlist', icon: ClipboardList, showBadge: false },
  { title: 'ID Verification', url: '/admin/id-verifications', icon: Shield, showBadge: false },
  { title: 'Helper Verification', url: '/admin/helpers', icon: HeartHandshake, showBadge: false },
  { title: 'Training Management', url: '/admin/training', icon: GraduationCap, showBadge: false },
  { title: 'Evidence Review', url: '/admin/evidence', icon: FileCheck, showBadge: false },
  { title: 'Content Moderation', url: '/admin/moderation', icon: Shield, showBadge: false },
  { title: 'Feedback', url: '/admin/feedback', icon: MessageSquare, showBadge: true },
  { title: 'Red Flags', url: '/admin/red-flags', icon: AlertTriangle, showBadge: false },
  { title: 'Badge Management', url: '/admin/badges', icon: Award, showBadge: false },
  { title: 'Points Config', url: '/admin/points-config', icon: Sliders, showBadge: false },
  { title: 'Campaigns', url: '/admin/campaigns', icon: Award, showBadge: false },
  { title: 'Organizations', url: '/admin/organizations', icon: Users, showBadge: false },
  { title: 'Settings', url: '/admin/settings', icon: Settings, showBadge: false },
];

const safeguardingNavItems = [
  { title: 'Emergency Alerts', url: '/admin/safeguarding/alerts', icon: ShieldAlert, showBadge: true },
  { title: 'Active Sessions', url: '/admin/safeguarding/sessions', icon: Eye, showBadge: false },
  { title: 'DBS Reviews', url: '/admin/safeguarding/dbs', icon: FileText, showBadge: false },
  { title: 'Keywords', url: '/admin/safeguarding/keywords', icon: AlertCircle, showBadge: false },
];

const AdminSidebar = () => {
  const { counts } = useNotificationCounts();

  return (
    <Sidebar className="border-r-2 border-slate-700 bg-slate-900 shadow-lg">
      <SidebarContent className="bg-slate-900">
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold px-4 py-4 bg-slate-800 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="text-white">Admin Panel</span>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent className="p-2">
            <SidebarMenu className="space-y-1">
              {/* Back to Profile Button */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600"
                  >
                    <ArrowLeft className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">Back to Profile</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {/* Divider */}
              <div className="h-px bg-slate-700 my-2" />
              
              {/* Safeguarding Section */}
              <div className="px-2 py-2">
                <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 px-2">
                  🚨 Safeguarding
                </h3>
                {safeguardingNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative ${
                            isActive
                              ? 'bg-red-600 text-white font-semibold shadow-md'
                              : 'text-slate-300 hover:bg-red-900/30 hover:text-white'
                          }`
                        }
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="text-sm">{item.title}</span>
                        {item.showBadge && counts.safeguardingAlerts > 0 && (
                          <NotificationBadge 
                            count={counts.safeguardingAlerts} 
                            className="relative top-0 right-0 ml-auto bg-red-500"
                          />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </div>
              
              <div className="h-px bg-slate-700 my-2" />
              
              {/* General Admin Items */}
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.exact}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative ${
                          isActive
                            ? 'bg-blue-600 text-white font-semibold shadow-md'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">{item.title}</span>
                      {item.showBadge && (
                        <NotificationBadge 
                          count={counts.feedback} 
                          className="relative top-0 right-0 ml-auto"
                        />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
