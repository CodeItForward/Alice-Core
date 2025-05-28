import React from "react";

export default {
  name: "Sample Plugin",
  navLinks: [{ label: "Sample", path: "/sample" }],
  routes: [
    { path: "/sample", component: () => <div>This is the sample plugin page!</div> }
  ]
}; 