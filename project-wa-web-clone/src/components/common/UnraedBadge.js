import React from 'react';
import Badge from 'material-ui/Badge';

const UnraedBadge = ({isUnread}) => {
  if (isUnread === "None") {
    return <span />;
  }
  return (
    <span className="pull-right unraed-badge">
      <Badge badgeContent={isUnread === 0 ? "" : isUnread} primary={true} />
    </span>
  );
}

export default UnraedBadge;