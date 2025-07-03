import React from 'react';
import { GuestAuthProvider } from './guestAuth';
import { useGleanConfig } from './index';

interface WithGuestAuthProps {
  backend?: string;
}

export function withGuestAuth<P extends object>(
  Component: React.ComponentType<P>,
  backend?: string,
) {
  const WrappedComponent = (props: P & WithGuestAuthProps) => {
    const { options } = useGleanConfig();
    const authBackend = props.backend || backend;

    if (!options.enableAnonymousAuth || !authBackend) {
      return <Component {...props} />;
    }

    return (
      <GuestAuthProvider pluginOptions={options} backend={authBackend}>
        <Component {...props} />
      </GuestAuthProvider>
    );
  };

  WrappedComponent.displayName = `withGuestAuth(${Component.displayName || Component.name})`;

  return WrappedComponent;
} 