import React from "react";
import { Link } from "react-router-dom";

export default () => (
  <div class="p-5 m-4 bg-light rounded-3">
    <div class="container-fluid py-5">
      <h1 class="display-5 fw-bold">
        Lorem Ipsum
      </h1>
      <p class="fs-4">
        Vestibulum pretium nibh eros. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin mattis, lorem sit amet pretium feugiat, mauris ante venenatis arcu, id elementum metus massa nec orci. Aenean interdum condimentum neque nec mattis. Maecenas et nulla magna. Maecenas sit amet auctor nibh, vel tincidunt nisl. Curabitur convallis vehicula rhoncus. Curabitur scelerisque placerat sollicitudin. Etiam id est id sem sodales malesuada. Aenean feugiat lacus quis mauris varius posuere. Phasellus elit orci, semper faucibus finibus id, maximus vitae dui.
      </p>
      <Link
        to="#"
        className="btn btn-primary btn-lg"
        role="button"
      >
        Link to Next Page
      </Link>
    </div>
  </div >
);