import React from "react";

import { render, cleanup, prettyDOM, getByText, findByText, fireEvent, getAllByTestId, getByAltText, getByPlaceholderText, waitForElementToBeRemoved, waitFor } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {

  xit("renders without crashing", () => {
    render(<Application />);
  });

  xit("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { findByText } = render(<Application />);

    return findByText("Monday");
  });

  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { queryByText, findByText } = render(<Application />);

    return findByText("Monday").then(() => {
      fireEvent.click(queryByText("Tuesday"));
      expect(queryByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);
  
    await findByText(container, "Archie Cohen");
  
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
  
    fireEvent.click(getByAltText(appointment, "Add"));
  
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });
  
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
  
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
  
    await findByText(appointment, "Lydia Miller-Jones");
  
    const day = getAllByTestId(container, "day").find((day) => queryByText(day, "Monday"));
  
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

});