import React, { useState, useEffect } from "react";
import { Col, Form } from "react-bootstrap";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import categoriesService from "../../../services/categoriesService";
import { EndTimeDatePicker, StartTimeDatePicker } from "../../DateTimePicker";
import moment from "moment";

export const Search = ({ state, setState }) => {
  const [price, setPrice] = useState({ min: 1, max: 15000 });
  const [startTime, setStartTime] = useState(
    moment().add(2, "minutes").toDate()
  );
  const [endTime, setEndTime] = useState(
    moment().add(1, "months").add(10, "m").toDate()
  );
  const [isDateDisabled, setIsDateDisabled] = useState(true);
  const [categories, setCategories] = useState([]);

  //It's better to extract fecth categories logic in store because we're repeating unnecessary requests...
  //but let's leave it as it is now :D

  useEffect(() => {
    retrieveCategories();
  }, []);

  useEffect(() => {
    if (!isDateDisabled) {
      setState({
        startTime: startTime.toISOString("dd/mm/yyyy HH:mm"),
        endTime: endTime.toISOString("dd/mm/yyyy HH:mm"),
      });
    }
  }, [startTime, endTime, setState, isDateDisabled]);

  const retrieveCategories = () => {
    categoriesService.getAll().then((response) => {
      setCategories(response.data.data);
    });
  };

  return (
    <Col className="mt-5 mt-lg-0" lg={4}>
      <div>
        <div className="search-area default-item-search">
          <p>
            <i>Filters</i>
          </p>

          <Form>
            <Form.Group controlId="Title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                onChange={(e) => setState({ title: e.target.value })}
                type="input"
                placeholder="Search for given item by title"
                aria-label="Item search"
                aria-describedby="basic-addon1"
              />
            </Form.Group>
            <Form.Group controlId="Category">
              <Form.Label>Category</Form.Label>
              <Form.Control as="select">
                <option
                  defaultValue
                  onClick={() => setState({ subCategoryId: null })}
                >
                  Select category
                </option>
                {categories.map((category) => {
                  return category.subCategories.map((subCategory, index) => {
                    return (
                      <option
                        key={index}
                        onClick={(e) => {
                          setState({ subCategoryId: e.target.value });
                        }}
                        value={subCategory.id}
                      >
                        {subCategory.name}
                      </option>
                    );
                  });
                })}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="liveItems">
              <Form.Check
                onChange={() => setState({ getLiveItems: !state.getLiveItems })}
                type="switch"
                label="Live items"
              />
            </Form.Group>
            <Form.Group controlId="Price">
              <p className="mb-4">Price</p>
              <InputRange
                formatLabel={(value) => `€${value}`}
                step={100}
                value={price}
                maxValue={15000}
                minValue={1}
                onChange={(value) => {
                  setPrice(value);
                  setState({
                    minPrice: value.min < 1 ? 1 : value.min,
                    maxPrice: price.max,
                  });
                }}
              />
            </Form.Group>

            <Form.Group className="mt-5" controlId="isDateDisabled">
              <Form.Check
                onChange={() => {
                  setIsDateDisabled(!isDateDisabled);
                  if (!isDateDisabled) {
                    setState({
                      startTime: null,
                      endTime: null,
                    });
                  }
                }}
                type="switch"
                label="Modify date"
              />
            </Form.Group>
            <Form.Group controlId="StartingTime">
              <p>Starting time</p>
              <StartTimeDatePicker
                disabled={isDateDisabled}
                readOnly={true}
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
              />
            </Form.Group>
            <Form.Group controlId="EndTime">
              <p>End time</p>
              <EndTimeDatePicker
                disabled={isDateDisabled}
                readOnly={true}
                endTime={endTime}
                setEndTime={setEndTime}
                startTime={startTime}
              />
            </Form.Group>
          </Form>
        </div>
      </div>
    </Col>
  );
};
