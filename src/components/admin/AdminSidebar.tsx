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
  Sliders
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

const adminNavItems = [
  { title: 'Overview', url: '/admin', icon: LayoutDashboard, exact: true },
  { title: 'User Management', url: '/admin/users', icon: Users },
  { title: 'Waitlist', url: '/admin/waitlist', icon: ClipboardList },
  { title: 'Helper Verification', url: '/admin/helpers', icon: HeartHandshake },
  { title: 'Training Management', url: '/admin/training', icon: GraduationCap },
  { title: 'Evidence Review', url: '/admin/evidence', icon: FileCheck },
  { title: 'Content Moderation', url: '/admin/moderation', icon: Shield },
  { title: 'Red Flags', url: '/admin/red-flags', icon: AlertTriangle },
  { title: 'Badge Management', url: '/admin/badges', icon: Award },
  { title: 'Points & System', url: '/admin/customization', icon: Sliders },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

const AdminSidebar = () => {
  return (
    <Sidebar className="border-r-2 border-border bg-card shadow-lg">
      <SidebarContent className="bg-card">
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold px-4 py-4 bg-muted/50 border-b border-border">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-foreground">Admin Panel</span>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent className="p-2">
            <SidebarMenu className="space-y-1">
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.exact}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-primary text-primary-foreground font-semibold shadow-md'
                            : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">{item.title}</span>
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
