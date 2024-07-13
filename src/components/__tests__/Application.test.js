import React from "react";

import { render, cleanup, prettyDOM, getByText, findByText, fireEvent, getAllByTestId, getByAltText, getByPlaceholderText, waitForElementToBeRemoved, queryByText, queryByAltText,  findByAltText } from "@testing-library/react";

import Application from "components/Application";

import axios from "axios";

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

  xit("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
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

  xit("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await findByText(container, "Archie Cohen");
  
    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find((appointment) =>
      queryByText(appointment, "Archie Cohen")
    );
  
    fireEvent.click(queryByAltText(appointment, "Delete"));
  
    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
  
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));
  
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
  
    // 7. Wait until the element with the "Add" button is displayed.
    await findByAltText(appointment, "Add");
  
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find((day) => queryByText(day, "Monday"));
  
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });
  
  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);
  
    await findByText(container, "Archie Cohen");
  
    const appointment = getAllByTestId(container, "appointment").find((appointment) =>
      queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Edit"));
  
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });
  
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
  
    fireEvent.click(getByText(appointment, "Save"));
  
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
  
    await findByText(appointment, "Lydia Miller-Jones");
  
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument(); 
  });
  
  it("shows the save error when failing to save an appointment", async () => {
    // Mock the axios put method to reject
    axios.put.mockRejectedValueOnce(new Error("Failed to save"));

    // Render the application
    const { container } = render(<Application />);
    
    // Wait for the initial data to load
    await getByText(container, "Archie Cohen");

    // Click the "Add" button on the first empty appointment
    const appointment = getAllByTestId(container, "appointment")[0];
    fireEvent.click(getByAltText(appointment, "Add"));

    // Enter the student name
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });

    // Select the interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // Click the "Save" button
    fireEvent.click(getByText(appointment, "Save"));

    // Check that the error message is displayed
    expect(getByText(appointment, "Could not save appointment.")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    // Mock the axios delete method to reject
    axios.delete.mockRejectedValueOnce(new Error("Failed to delete"));

    // Render the application
    const { container } = render(<Application />);

    // Wait for the initial data to load
    await getByText(container, "Archie Cohen");

    // Click the "Delete" button on the booked appointment
    const appointment = getAllByTestId(container, "appointment").find((appointment) =>
      getByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Delete"));

    // Check that the confirmation message is shown
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // Click the "Confirm" button
    fireEvent.click(getByText(appointment, "Confirm"));

    // Check that the error message is displayed
    expect(getByText(appointment, "Could not delete appointment.")).toBeInTheDocument();
  });
  
});