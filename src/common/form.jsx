import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import axios from "axios";
import DisplayImage from "./displayImage";
import UploadImage from "./uploadImage";
import { jsonToFormData } from "../utils/jsonToFormData";
import Select from "./select";
import moment from "moment";
import Moment from "react-moment";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import "./form.css";
// import { NumericFormat } from "react-number-format";
import BooleanSelect from "./booleanSelect";
import Checkbox from "./checkbox";

class Form extends Component {
  state = {
    data: {},
    error: {},
    form: "",
    inputItem: "",
    sendFile: false,
    fileObj: [],
    fileArray: [],

    // image: null, // when uploaded
    // selectedimage: null,
  };
  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    // console.log(error);
    if (!error) return null;
    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;

    return errors;
  };

  handleChangeList = ({ currentTarget: input }, index) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };

    data[input.name][index] = input.value;
    this.setState({ data, errors });
  };
  changeBoolean = (name, value) => {
    const data = { ...this.state.data };
    data[name] = value;
    this.setState({ data });
  };

  handleChange = ({ currentTarget: input }) => {
    const errorMessage = this.validateProperty(input);
    const errors = { ...this.state.errors };

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };

    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  handleDeleteItem = (e, array, i) => {
    e.preventDefault();

    const data = { ...this.state.data };
    data[array].splice(i, 1);
    this.setState({ data });
  };
  handleCheckboxChange = (name, value, isChecked) => {
    const data = { ...this.state.data };
    if (isChecked) {
      if (!data[name].includes(value)) {
        data[name].push(value);
      }
    } else {
      data[name] = data[name].filter((item) => item !== value);
    }
    this.setState({ data });
  };
  filePathset = (e, destination) => {
    // e.stopPropagation();
    e.preventDefault();
    let file = e.target.files[0];
    this.readFile(file, destination);
  };
  readFile = (file, destination) => {
    // e.stopProqpagation();
    // e.preventDefault();

    const reader = new FileReader();
    reader.onload = (evt) => {
      // evt = on_file_select event
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      /* Convert array of arrays */
      const datas = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      /* Update state */
      // console.log("Data>>>" + data); // shows that excel data is read
      // console.log(convertToJson(data));
      const data = { ...this.state.data };
      data[destination] = this.convertToJson(datas);

      this.setState({ data });
    };
    reader.readAsBinaryString(file);
  };

  convertToJson = (csv) => {
    var liste = csv.split("\n");
    var headers = liste[0].split(",");
    // console.log(headers);

    // var obj = {};
    let result = [];

    // for (var i = 1; i < liste.length; i++) {
    liste.map((item, index1) => {
      if (index1 !== 0 && item !== "") {
        // var currentline = liste[i].split(",");
        const arrayItem = item.split(",");
        // for (var j = 0; j < headers.length; j++) {
        const obj = {};
        headers.map((title, index2) => {
          // console.log(title);
          // console.log(arrayItem, index2);

          //   obj[headers[j]] = currentline[j];
          obj[title] = arrayItem[index2];
          return true;
          // }
        });
        result.push(obj);
      }
      return true;
    });

    return result; //JavaScript object
    // return JSON.stringify(result); //JSON
  };
  exportCsv = (csvData, fileName) => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const exportToCsv = (e, csvData, fileName) => {
      e.preventDefault();
      csvData.map((e) => delete e["_id"]);
      const ws = XLSX.utils.json_to_sheet(csvData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName + fileExtension);
    };
    return (
      <button onClick={(e) => exportToCsv(e, csvData, fileName)}>
        Télécharger Excel
      </button>
    );
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();

    this.setState({ errors: errors || {} });
    const sendFile = this.state.sendFile;
    if (sendFile) {
      return this.fileUploadHandler();
    }
    if (errors) return;
    this.doSubmit();
  };

  fileUploadHandler = async () => {
    let fd = new FormData();
    const form = this.state.form;
    let data = { ...this.state.data };
    delete data._id;
    delete data.images;
    fd = jsonToFormData(data);
    // for (const item in data) {
    //   if (Array.isArray(data[item])) {
    //     data[item].map((i, index) => fd.append(item + `[${index}]`, i));
    //   } else if (typeof data[item] === "object") {
    //     for (let key in data[item]) {
    //       console.log(data[item], data[item][key]);
    //       fd.append(key, data[item][key]);
    //     }
    //   } else {
    //     fd.append(item, data[item]);
    //   }
    // }
    for (const item in this.state) {
      if (item.includes("selected")) {
        let filename = item.replace("selected", "");
        for (let i = 0; i < this.state[item][0].length; i++) {
          fd.append(
            filename,
            this.state[item][0][i],
            this.state[item][0][i].name,
          );
        }
      }
    }
    this.props.match !== undefined &&
    this.props.match.params.id &&
    this.props.match.params.id != "new"
      ? await axios.put(
          `${process.env.REACT_APP_API_URL}/${form}/${this.props.match.params.id}`,
          fd,
        )
      : await axios.post(`${process.env.REACT_APP_API_URL}/${form}`, fd);
    if (this.props.match) this.props.history.push(`/${form}`);
    else {
      window.location.reload();
    }
  };

  fileSelectedHandler = (event) => {
    let fileObj = [];
    let fileArray = [];
    if (event.target.files && event.target.files[0]) {
      fileObj.push(event.target.files);
      for (let i = 0; i < fileObj[0].length; i++) {
        fileArray.push(URL.createObjectURL(fileObj[0][i]));
      }
      // for (let item in fileObj[0]) {
      //   console.log(fileObj[0][item]);
      //   // fileArray.push(URL.createObjectURL(fileObj[0][item]));
      // }
      this.setState({
        ["selected" + event.target.name]: fileObj,
      });
      this.setState({
        [event.target.name]: fileArray,
      });
      this.setState({ sendFile: true });
    }
  };

  renderUpload(
    name,
    label,
    type = "file",
    widthLabel = 96,
    width = 170,
    height = 35,
  ) {
    const image = this.state[name];

    return (
      <UploadImage
        name={name}
        width={width}
        image={image}
        height={height}
        widthLabel={widthLabel}
        type={type}
        label={label}
        onChange={this.fileSelectedHandler}
      />
    );
  }
  handleDeleteImage = (name, e, index) => {
    e.preventDefault();
    const { data } = this.state;
    // console.log(data);
    // add index to deletedImages if not existed
    data[`${name}DeletedIndex`].indexOf(index) === -1 &&
      data[`${name}DeletedIndex`].push(index);
    // delete image from array
    this.setState({ data });
  };
  renderImage(name, label, width = 170, height = 200, widthLabel = 96) {
    const { data /* errors */ } = this.state;
    return (
      <DisplayImage
        name={name}
        widthLabel={widthLabel}
        images={data[name]}
        deleteImage={this.handleDeleteImage}
        label={label}
        width={width}
        height={height}
      />
    );
  }

  renderButton(label) {
    return (
      <div className="mr-6 mt-3 flex w-full justify-end">
        <button
          className={
            !this.validate()
              ? "cursor-pointer rounded-5px border-0   bg-custom-blue pl-3 pr-3 text-xs font-medium leading-7 text-white shadow-custom "
              : "pointer-events-none cursor-not-allowed rounded-5px   border border-blue-40 bg-grey-ea pl-3 pr-3 text-xs leading-7 text-grey-c0"
          }
        >
          {label}
        </button>
      </div>
    );
  }

  uploadExcel(name, destination, label) {
    return (
      <div className="form-file">
        <div className="upload-file">
          <label className="upload-file-label">{label}</label>
          <input
            type="file"
            name={name}
            onChange={(e) => this.filePathset(e, destination)}
          />
        </div>
      </div>
    );
  }
  renderCheckboxes(name, label, width, widthLabel, listItems, labelItems) {
    const { data } = this.state;
    return (
      <Checkbox
        name={name}
        label={label}
        width={width}
        widthLabel={widthLabel}
        listItems={listItems}
        labelItems={labelItems}
        value={data[name]}
        onChange={this.handleCheckboxChange}
      />
    );
  }
  renderSelect(
    name,
    label,
    options,
    width = 170,
    height = 35,
    widthLabel = 96,
  ) {
    const { data, errors } = this.state;
    return (
      <Select
        name={name}
        value={data[name]}
        label={label}
        options={options}
        widthLabel={widthLabel}
        width={width}
        height={height}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderBoolean(
    name,
    label,
    label1,
    label2,
    width = 85,
    height = 35,
    widthLabel = 96,
  ) {
    const { data /* error */ } = this.state;

    return (
      <BooleanSelect
        name={name}
        value={data[name]}
        label={label}
        label1={label1}
        label2={label2}
        width={width}
        height={height}
        widthLabel={widthLabel}
        changeBoolean={(value) => this.changeBoolean(name, value)}
      />
    );
  }

  renderInput(
    name,
    label,
    width = 170,
    height = 35,
    type = "text",
    widthLabel = 96,
  ) {
    const { data, errors } = this.state;
    return (
      <Input
        type={type}
        name={name}
        value={data[name] || ""}
        label={label}
        width={width}
        height={height}
        widthLabel={widthLabel}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderDate(name, label, width = 170, height = 35, widthLabel = 96) {
    const { data, errors } = this.state;

    return (
      <div className=" flex flex-col">
        <div className=" flex w-fit flex-wrap">
          <label
            className="mr-3  text-right text-xs font-bold leading-9 text-[#72757c]"
            htmlFor={name}
            style={{ width: widthLabel }}
          >
            {label}
          </label>
          {/* <Calendar onChange={this.handleChange} value={data[name]} /> */}
          <input
            className=" rounded-md	border-0 bg-[#dddbf3] pl-3 pr-3 text-xs font-bold text-[#1f2037] shadow-inner "
            name={name}
            style={{ width: width, height: height }}
            id={name}
            type="date"
            placeholder="dd-mm-yyyy"
            value={
              data[name]
                ? moment(new Date(data[name])).format("YYYY-MM-DD")
                : ""
            }
            onChange={this.handleChange}
          />
        </div>
        {errors[name] && (
          <div
            className={`ml-2  mt-2 flex w-[${
              width + widthLabel
            }]px text-xs text-red-500`}
          >
            {errors[name]}
          </div>
        )}
      </div>
    );
  }

  addItem = (e, inputItem) => {
    e.preventDefault();
    const errors = { ...this.state.errors };

    // if (typeof inputItem !== "object") {
    //   const errorMessage = this.validateProperty(e.currentTarget);

    //   if (errorMessage) errors[e.currentTarget.name] = errorMessage;
    //   else delete errors[e.currentTarget.name];
    // }

    const data = { ...this.state.data };
    /* data[e.currentTarget.name]
      ? data[e.currentTarget.name].push(inputItem)
      :  */ data[e.currentTarget.name + "s"].push(inputItem);
    this.setState({ data, errors });
    switch (typeof inputItem) {
      case "string":
        this.setState({ [e.target.name]: "" });
        break;
      case "object":
        let emptyObject = {};
        for (const key in inputItem) {
          emptyObject[key] = "";
          // inputItem[key] = "";
        }

        this.setState({ [e.target.name]: emptyObject });
        break;

      default:
        break;
    }
  };
  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);

    return error ? error.details[0].message : null;
  };

  updateInputItem = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  renderInputList(
    name,
    label,
    type = "text",
    width = 170,
    height = 35,
    widthLabel = 96,
  ) {
    const inputItem = this.state[name];
    return (
      <div className="flex flex-col items-end">
        <Input
          key={name}
          value={inputItem || ""}
          name={name}
          type={type}
          width={width}
          height={height}
          label={label}
          widthLabel={widthLabel}
          placeholder={`ajouter ${name}`}
          onChange={this.updateInputItem}
          // error={errors[name]}
        />
        <button
          className={`mt-1 h-5 w-5  rounded-sm bg-lime-500  p-0 text-sm font-bold text-white shadow-md ${
            !inputItem && "pointer-events-none cursor-not-allowed bg-slate-200"
          }`}
          name={name}
          onClick={(e) => this.addItem(e, inputItem)}
        >
          +
        </button>
      </div>
    );
  }

  renderList(name, label, width = 170, height = 35, widthLabel = 96) {
    const { data, errors /* , inputItem  */ } = this.state;
    return (
      <div className="mt-3">
        {data[name] &&
          data[name].map((item, index) => {
            return (
              <div key={index} className="flex items-center">
                <Input
                  name={name}
                  key={name + index}
                  widthLabel={widthLabel}
                  width={width}
                  height={height}
                  value={item}
                  label={label + " " + (index + 1)}
                  onChange={(e) => this.handleChangeList(e, index)}
                  // error={errors[name]}
                />
                <button
                  className="ml-2 mt-2 h-5 w-5  rounded-sm bg-red-500 p-0 text-sm font-bold text-white shadow-md"
                  onClick={(e) => this.handleDeleteItem(e, name, index)}
                  // className=" col-md-1 btn btn-danger btn-sm pull-right"
                >
                  -
                </button>
              </div>
            );
          })}
      </div>
    );
  }

  renderObjectInputList(name, label, width = 30, type = "text") {
    const { [name]: inputItem } = this.state;
    let array = [];
    for (const key in inputItem) {
      array.push(
        <div className="input-object-item" key={key}>
          <label htmlFor={key}>{key}</label>
          <input
            type={type}
            id={key + name}
            name={key}
            value={inputItem[key] || ""}
            onChange={(e) => this.handleChangeObjectList(e, name)}
            style={{ width: width, height: 30 }}
          />
          {/* {errors[key] && (
            <div className="input-component-error">{errors[key]}</div>
          )} */}
        </div>,
      );
    }
    return (
      <div className="input-object">
        <p> {label}</p>
        <div className="input-object-items">
          {array}
          <button name={name} onClick={(e) => this.addItem(e, inputItem)}>
            Ajouter
          </button>
        </div>
      </div>
    );
  }

  handleChangeObjectList = ({ currentTarget: input }, name) => {
    // const errorMessage = this.validateProperty(input);
    // const errors = { ...this.state.errors };

    // if (errorMessage) errors[input.name] = errorMessage;
    // else delete errors[input.name];

    const data = { ...this.state[name] };
    data[input.name] = input.value;
    this.setState({ [name]: data /*  errors */ });
  };

  handleChangeObject = ({ currentTarget: input }, name) => {
    // const errorMessage = this.validateProperty(input);
    // const errors = { ...this.state.errors };

    // if (errorMessage) errors[input.name] = errorMessage;
    // else delete errors[input.name];

    const data = { ...this.state.data };

    data[name][input.name] = input.value;
    this.setState({ data /* , errors  */ });
  };

  handleChangeObjectSelect = ({ currentTarget: input }, name, element) => {
    const data = { ...this.state.data };
    data[name][element] = input.value;
    this.setState({ data /* , errors  */ });
  };

  renderObject(
    name,
    label,
    width = 170,
    height = 35,
    type = "text",
    selectElement,
    arraySelect,
    selectedAttributes,
    widthLabel = 96,
  ) {
    const { data /* , errors */ } = this.state;
    // console.log(indexSelectType);
    let array = [];
    for (const key in data[name]) {
      let label1 = "";

      label1 =
        selectedAttributes.find((item) => item[0] === key.toString()) &&
        selectedAttributes.find((item) => item[0] === key.toString())[1];
      if (
        !selectedAttributes ||
        (selectedAttributes &&
          selectedAttributes.length !== 0 &&
          /* selectedAttributes.includes(key.toString()) */
          // in each item of selectedAttributes , the item is an array , the first element of item if it is the same as the key

          selectedAttributes.some((item) => item[0] === key.toString()))
      ) {
        // i want to name the label with the second element of the item

        let indexSelect = undefined;
        if (selectElement) indexSelect = selectElement.indexOf(key);
        if ((indexSelect || indexSelect === 0) && indexSelect !== -1) {
          array.push(
            <div key={key + name} className="mt-3">
              <Select
                name={name}
                value={data[name][key]}
                label={label1}
                options={arraySelect[indexSelect]}
                widthLabel={widthLabel}
                width={width}
                id={key + name}
                height={height}
                onChange={(e) => this.handleChangeObjectSelect(e, name, key)}
                // error={errors[name]}
              />
            </div>,
            // <div key={key} className="select-component select-in-object">
            //   <label htmlFor={key}>{key}</label>

            //   <select
            //     id={key + name}
            //     name={key}
            //     onChange={(e) => this.handleChangeObject(e, name)}
            //     value={data[name][key]}
            //   >
            //     {/* <option value="" /> */}
            //     {arraySelect[indexSelect].map((option) => {
            //       return (
            //         <option key={option} value={option}>
            //           {option}
            //         </option>
            //       );
            //     })}
            //   </select>

            /* {errors[key] && (
            <div className="input-component-error">{errors[key]}</div>
          )} */
            // </div>,
          );
        } else {
          array.push(
            <div key={key + name} className="mt-3">
              <Input
                type={type}
                name={key}
                value={data[name][key] || ""}
                label={label1}
                width={width}
                height={height}
                id={key + name}
                widthLabel={widthLabel}
                onChange={(e) => this.handleChangeObject(e, name)}
                // error={errors[name]}
              />
            </div>,
            //   <div className="object-input-item" key={key}>
            //     <label htmlFor={key}>{key}</label>
            //     <input
            //       type={type}
            //       id={key + name}
            //       name={key}
            //       value={data[name][key] || ""}
            //       onChange={(e) => this.handleChangeObject(e, name)}
            //       style={{ width: width, height: 30 }}
            //     />
            //     {/* {errors[key] && (
            //   <div className="input-component-error">{errors[key]}</div>
            // )} */}
            //   </div>,
          );
        }
      }
    }
    return (
      <div className="mt-3 flex flex-row">
        {/* <div
          style={{
            width: widthLabel,
          }}
          className="mr-3  text-right text-xs font-bold leading-9 text-[#72757c]"
        >
          {label}
        </div> */}
        <div className="flex flex-wrap">{array}</div>
      </div>
    );
  }
  handleChangeObjectDateDebutFin = (
    { currentTarget: input },
    name,
    isDateDebut,
    index,
  ) => {
    const data = { ...this.state.data };
    isDateDebut
      ? (data[name][index].dateDebut = input.value)
      : (data[name][index].dateFin = input.value);
    if (data[name][index]) {
      let isDateCorrect = true;
      data[name].map((item, index1) => {
        if (index1 !== index) {
          if (
            item.dateFin &&
            data[name][index].dateDebut &&
            new Date(item.dateFin) >= new Date(data[name][index].dateDebut)
          ) {
            isDateCorrect = false;
            return true;
          }
        }
        return false;
      });
      if (!isDateCorrect) {
        data[name][index].dateDebut = "";
        data[name][index].dateFin = "";
      }
    }
    // 2. si la date de fin est inférieur à la date de début alors set dateFin to "";
    if (
      data[name][index].dateDebut &&
      data[name][index].dateFin &&
      new Date(data[name][index].dateDebut) >
        new Date(data[name][index].dateFin)
    )
      data[name][index].dateFin = "";

    this.setState({ data });
  };
  renderObjectInputDateDebutFinTable(
    name,
    labelTable = "",
    selectedItems,
    labelItems,
    selectItems,
    selectOptions,
    isDelete = true,
    width = 170,
    widthLabel = 96,
  ) {
    const { data } = this.state;
    let tr = [];
    if (data[name] && data[name].length !== 0)
      data[name]
        .sort((a, b) => new Date(a.dateDebut) - new Date(b.dateDebut))
        .map((column, index1) => {
          let td = [];
          // add order number
          td.push(
            <td key={"order" + index1}>
              <div className=" text-center text-xs font-bold text-[#72757c]">
                {index1 + 1}
              </div>
            </td>,
          );
          selectedItems.map((item, index2) => {
            if (selectItems.includes(item))
              td.push(
                <td key={item + index1}>
                  <div className="p-2">
                    {data[name][index1].dateDebut ? (
                      <div className="text-center text-xs font-bold ">
                        {
                          selectOptions[index2].find(
                            (option) => option._id === data[name][index1][item],
                          ).nom
                        }
                      </div>
                    ) : (
                      <Select
                        name={item}
                        value={data[name][index1][item]}
                        options={selectOptions[index2]}
                        width={width}
                        id={name}
                        height={40}
                        onChange={(e) => {
                          const data = { ...this.state.data };
                          data[name][index1][item] = e.target.value;
                          this.setState({ data });
                        }}
                      />
                    )}
                  </div>
                </td>,
              );
            else
              td.push(
                <td key={item + index1}>
                  <div className="pl-2">
                    {data[name][index1].dateDebut ? (
                      <div className="text-center text-xs font-bold ">
                        {data[name][index1][item]}
                      </div>
                    ) : (
                      <Input
                        type="text"
                        name={item}
                        value={data[name][index1][item]}
                        width={width}
                        height={40}
                        onChange={(e) => {
                          const data = { ...this.state.data };
                          data[name][index1][item] = e.target.value;
                          this.setState({ data });
                        }}
                      />
                    )}
                  </div>
                </td>,
              );
            return "";
          });

          td.push(
            <td key={"dateDebut" + index1}>
              <div className="p-2 text-center text-xs font-bold">
                {data[name][index1].dateDebut ? (
                  <Moment
                    date={data[name][index1].dateDebut}
                    format="DD/MM/YYYY"
                  >
                    {data[name][index1].dateDebut}
                  </Moment>
                ) : (
                  <Input
                    type="date"
                    name="dateDebut"
                    value={
                      data[name][index1].dateDebut
                        ? new Date(data[name][index1].dateDebut)
                            .toISOString()
                            .slice(0, 10)
                        : ""
                    }
                    onChange={(e) =>
                      this.handleChangeObjectDateDebutFin(e, name, true, index1)
                    }
                    width={120}
                    height={40}
                  />
                )}
              </div>
            </td>,
          );
          td.push(
            <td key={"dateFin" + index1}>
              <div className="p-2 text-center text-xs font-bold">
                {data[name][index1].dateDebut && data[name][index1].dateFin ? (
                  <Moment date={data[name][index1].dateFin} format="DD/MM/YYYY">
                    {data[name][index1].dateFin}
                  </Moment>
                ) : (
                  <Input
                    type="date"
                    name="dateFin"
                    value={
                      data[name][index1].dateFin
                        ? new Date(data[name][index1].dateFin)
                            .toISOString()
                            .slice(0, 10)
                        : ""
                    }
                    onChange={(e) =>
                      this.handleChangeObjectDateDebutFin(
                        e,
                        name,
                        false,
                        index1,
                      )
                    }
                    width={120}
                    height={40}
                    // error={
                    //   data[name][index1].dateDebut &&
                    //   data[name][index1].dateFin &&
                    //   new Date(data[name][index1].dateDebut) >
                    //     new Date(data[name][index1].dateFin) &&
                    //   "La date de fin doit être supérieure à la date de début"
                    // }
                  />
                )}
              </div>
            </td>,
          );
          if (isDelete)
            td.push(
              <td key={"supprimer" + index1}>
                <div className="flex">
                  <button
                    className="mx-auto h-5 w-5  rounded-sm bg-red-500 p-0 text-sm font-bold text-white shadow-md"
                    onClick={(e) => this.handleDeleteItem(e, name, index1)}
                    // className=" col-md-1 btn btn-danger btn-sm pull-right"
                  >
                    -
                  </button>
                </div>
              </td>,
            );
          tr.push(
            <tr
              className="h-10 border-b-2 border-[#72757c]"
              key={"tr" + index1}
            >
              {td}
            </tr>,
          );
          return "";
        });

    return (
      <div className="flex flex-wrap">
        {labelTable ? (
          <div
            style={{ width: widthLabel }}
            className="mr-3 flex  items-center justify-end  text-right text-xs font-bold leading-9 text-[#72757c]"
          >
            {labelTable}
          </div>
        ) : (
          ""
        )}
        <table className="mx-2 border-2 border-[#72757c] shadow-md">
          <thead className="h-10 border-b-2 border-[#72757c]">
            <tr>
              <th className="min-w-[30px]">
                <div className="text-center  text-xs font-bold text-[#72757c]">
                  #
                </div>
              </th>
              {labelItems.map((item, index) => {
                return (
                  <th className="min-w-[120px]" key={item + index}>
                    <div className="text-xs font-bold text-[#72757c]">
                      {item}
                    </div>
                  </th>
                );
              })}

              <th className="min-w-[120px]">
                <div className="text-xs font-bold text-[#72757c]">
                  Date début
                </div>
              </th>
              <th className="min-w-[120px]">
                <div className="text-xs font-bold text-[#72757c] ">
                  Date fin
                </div>
              </th>
              {isDelete && (
                <th className="min-w-[80px]">
                  <div className="text-xs font-bold text-[#72757c] ">
                    Supprimer
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>{tr}</tbody>
        </table>
      </div>
    );
  }

  renderObjectInputDateDebutFin(
    objectName,
    label,
    listItems,
    selectedItems,
    labelItems,
    selectItems,
    selectOptions,
    width = 170,
    widthLabel = 96,
  ) {
    const { [objectName]: inputItem } = this.state;
    let isDateCorrect = true;
    if (
      inputItem.dateDebut &&
      inputItem.dateFin &&
      new Date(inputItem.dateDebut) > new Date(inputItem.dateFin)
    )
      isDateCorrect = false;
    let isAdd = true;
    let isIncluded = false;
    if (isDateCorrect) {
      listItems.length !== 0 &&
        listItems.map((e) => {
          if (!e.dateDebut || !e.dateFin) isAdd = false;
          return "";
        });
      if (listItems.length !== 0)
        listItems.some((e) => {
          if (inputItem.dateDebut && !inputItem.dateFin) {
            if (
              new Date(
                new Date(e.dateFin).getFullYear(),
                new Date(e.dateFin).getMonth(),
                new Date(e.dateFin).getDate(),
              ) >=
              new Date(
                new Date(inputItem.dateDebut).getFullYear(),
                new Date(inputItem.dateDebut).getMonth(),
                new Date(inputItem.dateDebut).getDate(),
              )
            ) {
              isIncluded = true;
              return true;
            }
          } else if (inputItem.dateDebut && inputItem.dateFin) {
            if (
              new Date(
                new Date(e.dateDebut).getFullYear(),
                new Date(e.dateDebut).getMonth(),
                new Date(e.dateDebut).getDate(),
              ) <=
                new Date(
                  new Date(inputItem.dateFin).getFullYear(),
                  new Date(inputItem.dateFin).getMonth(),
                  new Date(inputItem.dateFin).getDate(),
                ) &&
              new Date(
                new Date(e.dateFin).getFullYear(),
                new Date(e.dateFin).getMonth(),
                new Date(e.dateFin).getDate(),
              ) >=
                new Date(
                  new Date(inputItem.dateDebut).getFullYear(),
                  new Date(inputItem.dateDebut).getMonth(),
                  new Date(inputItem.dateDebut).getDate(),
                )
            ) {
              isIncluded = true;
              return true;
            }
          }
          return false;
        });
    }

    return (
      isAdd && (
        <div className="flex flex-wrap">
          <div
            style={{ width: widthLabel }}
            className="mr-3 flex items-center justify-end text-right text-xs font-bold leading-9 text-[#72757c]"
          >
            {label}
          </div>
          {
            <div className="flex flex-col">
              <div className="flex flex-wrap">
                {selectedItems.length !== 0 &&
                  selectedItems.map((item, index) => {
                    if (selectItems.includes(item))
                      return (
                        <div className="mt-3" key={objectName + index}>
                          <Select
                            name={item}
                            value={inputItem[item] || ""}
                            label={labelItems[index]}
                            options={selectOptions}
                            width={width}
                            id={item}
                            height={40}
                            widthLabel={96}
                            onChange={(e) =>
                              this.handleChangeObjectList(e, objectName)
                            }
                          />
                        </div>
                      );
                    else
                      return (
                        <div className="mt-3" key={objectName + index}>
                          <Input
                            type="text"
                            name={item}
                            value={inputItem[item] || ""}
                            label={labelItems[index]}
                            width={width}
                            widthLabel={96}
                            height={40}
                            onChange={(e) =>
                              this.handleChangeObjectList(e, objectName)
                            }
                            // error={errors[name]}
                          />
                        </div>
                      );
                  })}

                <div className="mt-3">
                  <Input
                    type="date"
                    name="dateDebut"
                    value={inputItem.dateDebut || ""}
                    label={"Date début"}
                    width={width}
                    widthLabel={96}
                    height={40}
                    onChange={(e) => this.handleChangeObjectList(e, objectName)}
                    // error={errors[name]}
                  />
                </div>

                <div className="mt-3">
                  <Input
                    type="date"
                    name="dateFin"
                    value={inputItem.dateFin || ""}
                    label={"Date fin"}
                    widthLabel={96}
                    width={width}
                    height={40}
                    onChange={(e) => this.handleChangeObjectList(e, objectName)}
                  />
                </div>
              </div>

              {isDateCorrect ? (
                !isIncluded ? (
                  <div className="m-auto">
                    {inputItem.dateDebut && (
                      <button
                        className="mt-1  rounded-sm  bg-lime-500  p-2 text-sm font-bold text-white shadow-md  "
                        name={objectName}
                        onClick={(e) => this.addItem(e, inputItem)}
                      >
                        Ajouter
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="ml-2 mt-2 w-auto text-xs font-bold text-red-500">
                    la période que vous avez saisie est déja existante
                  </div>
                )
              ) : (
                <div className=" my-2 ml-2 w-auto text-xs font-bold text-red-500">
                  Veuillez corrigé les dates saisies
                </div>
              )}
            </div>
          }
        </div>
      )
    );
  }
  renderObjectList(name, label, width = 30, type = "text") {
    const { data /* , errors */ } = this.state;

    let i = data[name].map((item, index) => {
      let textItem = "";

      for (const key in item) {
        textItem = textItem + " " + item[key];
      }

      return (
        <div className="text-list-item" key={uuidv4()}>
          {index + 1}. {textItem.trim()}
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            onClick={(e) => this.handleDeleteItem(e, name, index)}
          >
            <g filter="url(#filterDeleteButton)">
              <circle cx="15" cy="11" r="11" fill="white" />
            </g>
            <path
              d="M6.75 13.7231V8.25H23.25V13.75L6.75 13.7231Z"
              fill="#EB5757"
            />
            <defs>
              <filter
                id="filterDeleteButton"
                x="0"
                y="0"
                width="30"
                height="30"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.48 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </div>
      );
    });
    return <div className="input-object-list">{i}</div>;
  }
}

export default Form;
