import React, { Fragment } from "react";
import { Container, Row } from "reactstrap";
// import WidgetsWrapper from "./WidgetsWrapper";
// import OverallBalance from "./OverallBalance";
// import RecentOrders from "./RecentOrders";
// import ActivityCard from "./ActivityCard";
// import RecentSales from "./RecentSales";
// import TimelineCard from "./TimelineCard";

import GreetingCard from "./GreetingCard";

const Dashboard = () => {
  return (
    <Fragment>
      {/* <Breadcrumbs mainTitle="Default" parent="Dashboard" title="Default" /> */}
      <Container fluid={true}>
        <Row className="widget-grid">
          <GreetingCard />
          {/* <WidgetsWrapper /> */}
          {/* <OverallBalance />
          <RecentOrders />
          <ActivityCard />
          <RecentSales />
          <TimelineCard /> */}
          {/* <PreAccountCard />
          <TotalUserAndFollower />
          <PaperNote /> */}
        </Row>
      </Container>
    </Fragment>
  );
};

export default Dashboard;
