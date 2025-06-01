import React, { useState } from "react";
import {
  IconButton,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Slider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "react-bootstrap/Button";

const JobFilterSidebar = ({ onFilterChange, onClose }) => {
  const [title, setTitle] = useState("");
  const [jobType, setJobType] = useState("");
  const [salaryRange, setSalaryRange] = useState([0, 200000]);
  const [deadline, setDeadline] = useState(null);

  const handleSalaryChange = (event, newValue) => {
    setSalaryRange(newValue);
  };

  const applyFilters = () => {
    onFilterChange({
      title,
      jobType,
      salaryRange,
      deadline: deadline ? deadline.format("YYYY-MM-DD") : null,
    });
  };

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Close Button */}
      <div className="flex justify-end">
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>

      <p className="text-4xl font-bold mb-4 Ysabeau_Infant">Filter Jobs</p>

      {/* Job Title */}
      <TextField
        label="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        className="mb-4"
        color="error"
      />

      {/* Job Type - Radio */}
      <div className="mb-4">
        <FormLabel className="!text-xl !Ysabeau_Infant">Job Type</FormLabel>
        <RadioGroup
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
        >
          <FormControlLabel value="" control={<Radio className="!text-red-500"/>} label="All" />
          <FormControlLabel value="Full-Time" control={<Radio className="!text-red-500"/>} label="Full-Time" />
          <FormControlLabel value="Part-Time" control={<Radio className="!text-red-500"/>} label="Part-Time" />
          <FormControlLabel value="Internship" control={<Radio className="!text-red-500"/>} label="Internship" />
          <FormControlLabel value="contract" control={<Radio className="!text-red-500"/>} label="Contract" />
        </RadioGroup>
      </div>  

      {/* Salary Range - Slider */}
      <div className="mb-6">
        <FormLabel className="!text-xl !Ysabeau_Infant">Salary Range</FormLabel>
        <Slider
          value={salaryRange}
          onChange={handleSalaryChange}
          valueLabelDisplay="auto"
          min={0}
          max={200000}
          step={100}
          className="!text-red-500"
        />
        <div className="text-sm text-gray-600">
          ${salaryRange[0]} - ${salaryRange[1]}
        </div>
      </div>

      {/* Deadline */}
      <div className="mb-4">
        <DatePicker
          label="Deadline Before"
          value={deadline}
          color="error"
          onChange={(newValue) => setDeadline(newValue)}
        />
      </div>

      {/* Apply Filters Button */}
      <Button variant="outline-danger"   onClick={applyFilters}  >
        Apply Filters
      </Button>
    </div>
  );
};

export default JobFilterSidebar;
