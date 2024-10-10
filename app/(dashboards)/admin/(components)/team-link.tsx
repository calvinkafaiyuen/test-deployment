import React from 'react';
import {Link} from "@nextui-org/react";

interface TeamLinkRendererProps {
  value: string;
}

const TeamLinkRenderer: React.FC<TeamLinkRendererProps> = ({ value }) => {
  return (
    <Link 
      showAnchorIcon 
      isExternal 
      size="sm" 
      underline="hover" 
      href={`/account/${value}/profile`}
    >
      {value}
    </Link>
  );
};

export default TeamLinkRenderer;