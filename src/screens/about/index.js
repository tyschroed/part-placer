import React, { useEffect } from "react";
import { Grid, Typography, Link } from "@material-ui/core";
import { PaddedPaper } from "shared/components/pattern";
import { useAnalytics } from "shared/context/Analytics";

export default function About() {
  const { pageview } = useAnalytics();
  useEffect(() => {
    pageview("/about");
  });

  return (
    <Grid container>
      <Grid item xs={12}>
        <PaddedPaper>
          <Typography variant="h4">About Part Placer</Typography>
          <Typography variant="body1">
            Part Placer was developed by{" "}
            <Link href="https://tylerschroeder.com">Tyler Schroeder</Link> to
            speed up generating cut lists from a list of parts.
          </Typography>
          <Typography variant="h5">Methodology</Typography>
          <Typography variant="body1">
            Part Placer uses a bin packing algorithm based off of{" "}
            <Link href="http://pds25.egloos.com/pds/201504/21/98/RectangleBinPack.pdf">
              this paper
            </Link>
            .
          </Typography>
          <Typography variant="body1">
            Specifically, we run the materials and parts you enter through a
            guillotine algorithm several times, each time using a different set
            of heuristics. We then select the approach which yielded the lowest
            material usage.
          </Typography>
          <Typography variant="h4">Credits</Typography>
          <Typography variant="body1">
            Sawblade icon made by&nbsp;
            <Link href="https://www.flaticon.com/authors/srip" title="srip">
              srip
            </Link>
            &nbsp;
            <Link href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </Link>
          </Typography>
        </PaddedPaper>
      </Grid>
    </Grid>
  );
}
