const db = require("../models");
const { triggerRunBillGeneration, scheduleRef } = require("../utilities/billGeneration");
const CompanyInfo = db.companyInfo;

// Retrieve all CompanyInfo from the database.
exports.findOne = (req, res) => {
  CompanyInfo.findOne()
    .then((data) => {
      res.send({
        status: "Success",
        message: "CompanyInfo Fetched Successfully",
        data: data || {},
      });
    })
    .catch((err) => {
      res.status(500).send({
        status: "Failure",
        message:
          err.message || "Some error occurred while retrieving CompanyInfo.",
        data: null,
      });
    });
};

// Update a CompanyInfo by the id in the request
exports.update = async (req, res) => {
  let companyInfo = req.body;
  const schedulePeriods = {Weekly: "0 9 * * 1", Monthly: "0 9 1 * *", Yearly: "0 9 1 1 *"}
  if(companyInfo.billingCycle) {
    companyInfo.billingExpression = schedulePeriods[companyInfo.billingCycle]
  }
  const id = req.params.id;
  CompanyInfo.update(companyInfo, {
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        triggerRunBillGeneration(true)
        res.send({
          status: "Success",
          message: "CompanyInfo was updated successfully.",
          data: null,
        });
      } else {
        res.send({
          status: "Failure",
          message: `Cannot update CompanyInfo!`,
          data: null,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        status: "Failure",
        message: err.message || "Error updating Customer ",
        data: null,
      });
    });
};
