import React from "react";
import { Grid, Grow } from "@material-ui/core";
import Material from "./components/Material";
import EditMaterial from "./components/EditMaterial";
import { useStore } from "./components/Store";
function Home() {
  const { state } = useStore();

  return (
    <Grid container spacing={3}>
      {state.materials.map(material => (
        <Grow key={material.id} in={true} >
          <Grid item xs={3}>
            <Material
              id={material.id}
              name={material.name}
              parts={material.parts}
              width={material.dimensions.width}
              height={material.dimensions.height}
            />
          </Grid>
        </Grow>
      ))}
      <Grid item xs={3}>
        <EditMaterial />
      </Grid>
    </Grid>
  );
}

export default Home;
