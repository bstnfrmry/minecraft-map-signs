import { NextPage } from "next";
import React from "react";

import { Map } from "~/components/Map";
import { Layout } from "~/components/ui/Layout";

const Homepage: NextPage = () => {
  return (
    <Layout>
      <Map />
    </Layout>
  );
};

export default Homepage;
