import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import HubIcon from '@mui/icons-material/Hub';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import Logo from '../assets/logo_g.png'
import Dashboard from '../components/dashbord/Dashboard';
import ServiceRegistration from '../components/serviceRegistration/ServiceRegistration';
import { CollaboratorList } from '../components/collabaratorList/CollaboratorList';
import { ClientList } from '../components/clientList/ClientList';
import { ClientLeads } from '../components/clientLeads/ClientLeads';

const NAVIGATION = [
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'serviceregistration',
    title: 'Cadastro de serviço',
    icon: <NoteAltIcon />,
  },
  {
    segment: 'clientlist',
    title: 'Lista de Clientes',
    icon: <Groups2OutlinedIcon />,
  },
  {
    segment: 'collaboratorlist',
    title: 'Lista de Colaboradores',
    icon: <Diversity3Icon />,
  },
  {
    segment: 'clientLeads',
    title: 'Captação de clientes',
    icon: < HubIcon />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 400,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {pathname === '/dashboard' && <Dashboard/>}
      {pathname === '/serviceregistration' && <ServiceRegistration/>}
      {pathname === '/clientlist' && <ClientList/>}
      {pathname === '/collaboratorlist' && <CollaboratorList/>}
      {pathname === '/clientLeads' && <ClientLeads/>}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutBranding(props) {
  const { window } = props;

  const [pathname, setPathname] = React.useState('/dashboard');

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    // preview-start
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        logo: <img src={Logo} alt="logo" />,
        title: 'Brazilian Hands Cooperative',
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <DemoPageContent pathname={pathname} />
      </DashboardLayout>
    </AppProvider>
    // preview-end
  );
}

DashboardLayoutBranding.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default DashboardLayoutBranding;



