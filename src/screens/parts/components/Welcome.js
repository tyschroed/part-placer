import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  CardActions
} from "@material-ui/core";
import { useStore } from "../../../shared/context/Store";
import { PrimaryButton } from "../../../shared/components/Buttons";

export default function Welcome() {
  const { acknowledgeWelcome } = useStore();

  return (
    <>
      {
        <Card>
          <CardHeader
            title="Welcome to Part Placer!"
            subheader="Quickly generate an optimized cutlist!"
          />
          <CardContent>
            <Typography variant="h6">Getting Started</Typography>
            <Typography>
              <ol>
                <li>
                  Enter the raw materials which you will be using for your
                  project
                </li>
                <li>
                  For each material, enter the parts which will be cut out of
                  that material
                </li>
                <li>
                  Once all your parts are entered, click 'Generate Cutlist' to
                  produce an optimized parts layout!
                </li>
              </ol>
              <Typography variant="h6">Entering Dimensions</Typography>
              We'll take care of converting the dimensions for you - dimensions
              can be entered as fractions, decimals, with units or without (we
              assume inches if none are given). Some examples:
              <ul>
                <li>4 1/2"</li>
                <li>6' 2"</li>
                <li>4"</li>
                <li>4 (equivalent to 4")</li>
                <li>4cm</li>
                <li>4mm</li>
                <li>4m</li>
              </ul>
            </Typography>
          </CardContent>
          <CardActions>
            <PrimaryButton onClick={acknowledgeWelcome} fullWidth>
              Start Building!
            </PrimaryButton>
          </CardActions>
        </Card>
      }
    </>
  );
}
