
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const routeLabels = {
  '/': 'Dashboard',
  '/students': 'Students',
  '/batches': 'Batches',
  '/fees': 'Fees & Payments',
  '/payment-reports': 'Payment Reports',
  '/whatsapp': 'WhatsApp Integration',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

export const AppBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (location.pathname === '/') {
    return null; // Don't show breadcrumbs on dashboard
  }

  const breadcrumbItems = [
    {
      href: '/',
      label: 'Dashboard',
      icon: Home
    },
    ...pathnames.map((pathname, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
      const label = routeLabels[routeTo] || pathname.charAt(0).toUpperCase() + pathname.slice(1);
      return {
        href: routeTo,
        label: label,
        isLast: index === pathnames.length - 1
      };
    })
  ];

  return (
    <div className="mb-6">
      <Breadcrumb>
        <BreadcrumbList className="flex items-center space-x-2 text-sm">
          {breadcrumbItems.map((item, index) => (
            <div key={item.href} className="flex items-center">
              <BreadcrumbItem>
                {item.isLast ? (
                  <BreadcrumbPage className="text-foreground font-medium flex items-center">
                    {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink 
                    asChild 
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
                  >
                    <Link to={item.href}>
                      {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!item.isLast && (
                <BreadcrumbSeparator>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </BreadcrumbSeparator>
              )}
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
