import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import Form from "components/Appointment/Form";

afterEach(cleanup);

describe("Form", () => {
  const interviewers = [
    {
      id: 1,
      student: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png"
    }
  ];

  it("renders without student name if not provided", () => {
    const { getByPlaceholderText } = render(
      <Form interviewers={interviewers} />
    );
    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
  });

  it("renders with initial student name", () => {
    const { getByTestId } = render(
      <Form interviewers={interviewers} name="Lydia Miller-Jones" />
    );
    expect(getByTestId("student-name-input")).toHaveValue("Lydia Miller-Jones");
  });

  it("validates that the student name is not blank", () => {
    const onSave = jest.fn();
    const { getByText, getByTestId } = render(
      <Form interviewers={interviewers} onSave={onSave} />
    );

    fireEvent.click(getByText("Save"));

    // Assert that error message appears
    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled(); // Ensure onSave is not called
  });

  it("validates that the interviewer cannot be null", () => {
    const onSave = jest.fn();
    const { getByText, getByTestId } = render(
      <Form interviewers={interviewers} onSave={onSave} name="Lydia Miller-Jones" />
    );

    fireEvent.click(getByText("Save"));

    // Assert that error message appears
    expect(getByText(/please select an interviewer/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled(); // Ensure onSave is not called
  });

  it("calls onSave function when the name and interviewer is defined", () => {
    const onSave = jest.fn();
    const { getByText, getByTestId, queryByText } = render(
      <Form
        interviewers={interviewers}
        onSave={onSave}
        name="Lydia Miller-Jones"
        interviewer={interviewers[0].id} // Assuming interviewer ID is passed correctly
      />
    );

    fireEvent.click(getByText("Save"));

    // Assert that error messages do not appear
    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(queryByText(/please select an interviewer/i)).toBeNull();
    
    // Assert that onSave is called with correct arguments
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", 1); // Assuming interviewer ID 1 is selected
  });

});
