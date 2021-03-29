import React from "react";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { Box } from "@material-ui/core";
import Button from "@material-ui/core/Button";

export default function Profile() {
  return (
    <Container>
      <div
        className="profile"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar style={{ marginTop: "20px", marginBottom: "10px" }}>H</Avatar>
        <Typography component="" variant="h7">
          Username(or Nickname?)
        </Typography>
        <Button color="primary">edit</Button>
      </div>
    </Container>
  );
}
