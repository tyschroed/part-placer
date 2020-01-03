import React from "react";
import { Typography, Link } from "@material-ui/core";

export default function Footer() {
  return (
    <footer>
      <Typography color="secondary">
        Sawblade icon made by 
        <Link href="https://www.flaticon.com/authors/srip" title="srip">
          srip
        </Link>
        <Link href="https://www.flaticon.com/" title="Flaticon">
          www.flaticon.com
        </Link>
      </Typography>
    </footer>
  );
}
