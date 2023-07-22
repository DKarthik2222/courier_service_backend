const db = require("../models");
const Order = db.order;

// Create and Save a new Order
exports.create = async (req, res) => {
  // Validate request
  try {
    if (req.body.sender === undefined) {
      const error = new Error("Sender cannot be empty for order!");
      error.message = "Sender cannot be empty for order!";
      error.statusCode = 400;
      throw error;
    } else if (req.body.receiver === undefined) {
      const error = new Error("Receiver cannot be empty for order!");
      error.message = "Receiver cannot be empty for order!";
      error.statusCode = 400;
      throw error;
    } else if (req.body.pickupPoint === undefined) {
      const error = new Error("Pickup Point cannot be empty for order!");
      error.message = "Pickup Point cannot be empty for order!";
      error.statusCode = 400;
      throw error;
    } else if (req.body.dropoffPoint === undefined) {
      const error = new Error("Dropoff Point cannot be empty for order!");
      error.message = "Dropoff Point cannot be empty for order!";
      error.statusCode = 400;
      throw error;
    } else if (req.body.estimateTime === undefined) {
      const error = new Error("Estimated Time cannot be empty for order!");
      error.message = "Estimated Time cannot be empty for order!";
      error.statusCode = 400;
      throw error;
    } else if (req.body.estimateBlocks === undefined) {
      const error = new Error("Estimated Blocks cannot be empty for order!");
      error.message = "Estimated Blocks cannot be empty for order!";
      error.statusCode = 400;
      throw error;
    } else if (req.body.quotedPrice === undefined) {
      const error = new Error("Quoted Price cannot be empty for order!");
      error.message = "Quoted Price cannot be empty for order!!";
      error.statusCode = 400;
      throw error;
    } else if (req.body.deliveryInstructions === undefined) {
      const error = new Error(
        "Delivery Instructions cannot be empty for order!"
      );
      error.message = "Delivery Instructions cannot be empty for order!!";
      error.statusCode = 400;
      throw error;
    }
    req.body.statusId = 1;
    await Order.create(req.body)
      .then((data) => {
        res.send({
          status: "Success",
          message: "Order created successfully",
          data: null,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          status: "Failure",
          message:
            err.message || "Some error occurred while creating the Order.",
          data: null,
        });
      });
  } catch (e) {
    return res.status(500).send({
      status: "Failure",
      message: e.message,
      data: null,
    });
  }
};

// Retrieve all Orders from the database.
exports.findAll = async (req, res) => {
  try {
    const statusId = req.params.statusId;
    const customerId = req.params.customerId;
    let whereCondition = {};
    if (statusId != 0) {
      whereCondition.statusId = statusId;
    }
    if (customerId != "all") {
      whereCondition.sender = customerId;
    }
    await Order.findAll({
      where: whereCondition,
      include: [
        {
          model: db.employee,
          as: "assignedToDetails",
          attributes: ["empId", "firstName", "lastName"],
        },
        {
          model: db.customers,
          as: "senderDetails",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: db.customers,
          as: "receiverDetails",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: db.status,
          as: "status",
        },
      ],
    }).then((data) => {
      res.send({
        status: "Success",
        message: "Orders Fetched Successfully",
        data: data,
      });
    });
  } catch (err) {
    res.status(500).send({
      status: "Failure",
      message: err.message || "Some error occurred while retrieving orders.",
      data: null,
    });
  }
};

exports.findAllByEmployee = async (req, res) => {
  try {
    const empId = req.params.empId;
    await Order.findAll({
      where: { assignedTo: empId },
      include: [
        {
          model: db.customers,
          as: "senderDetails",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: db.customers,
          as: "receiverDetails",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: db.status,
          as: "status",
        },
      ],
    }).then((data) => {
      res.send({
        status: "Success",
        message: "Orders Fetched Successfully",
        data: data,
      });
    });
  } catch (err) {
    res.status(500).send({
      status: "Failure",
      message: err.message || "Some error occurred while retrieving orders.",
      data: null,
    });
  }
};

// Find a single Order with an id
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    await Order.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: db.customers,
          as: "senderDetails",
        },
        {
          model: db.customers,
          as: "receiverDetails",
        },
        {
          model: db.status,
          as: "status",
        },
      ],
    }).then((data) => {
      if (data) {
        res.send({
          status: "Success",
          message: "Order Fetched Successfully",
          data: data,
        });
      } else {
        res.status(404).send({
          status: "Failure",
          message: `Cannot find Order with id = ${id}.`,
          data: null,
        });
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send({
      status: "Failed",
      message: "Error fetching data!",
      data: null,
    });
  }
};

// Find a single order with an email id
exports.findByEmail = (req, res) => {
  const email = req.params.email;

  Order.findOne({
    where: {
      email: email,
    },
  })
    .then((data) => {
      if (data) {
        res.send({
          status: "Success",
          message: "Order Fetched Successfully",
          data: data,
        });
      } else {
        res.status(404).send({
          status: "Failure",
          message: `Cannot find Order with email = ${email}.`,
          data: null,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        status: "Failure",
        message: err.message || "Error retrieving Order with email = " + email,
        data: null,
      });
    });
};

// Update a Order by the id in the request
exports.update = async (req, res) => {
  try {
    if (req.body.sender === undefined) {
      const error = new Error("Sender cannot be empty for order!");
      error.message = "Sender cannot be empty for order!";
      error.statusCode = 400;
      throw error;
    } else if (req.body.receiver === undefined) {
      const error = new Error("Receiver cannot be empty for order!");
      error.message = "Receiver cannot be empty for order!";
      error.statusCode = 400;
      throw error;
    } else if (req.body.pickupPoint === undefined) {
      const error = new Error("Pickup Point cannot be empty for order!");
      error.message = "Pickup Point cannot be empty for order!";
      error.statusCode = 400;
      throw error;
    } else if (req.body.dropoffPoint === undefined) {
      const error = new Error("Dropoff Point cannot be empty for order!");
      error.message = "Dropoff Point cannot be empty for order!";
      error.statusCode = 400;
      throw error;
    } else if (req.body.estimateTime === undefined) {
      const error = new Error("Estimated Time cannot be empty for order!");
      error.message = "Estimated Time cannot be empty for order!";
      error.statusCode = 400;
      throw error;
    } else if (req.body.estimateBlocks === undefined) {
      const error = new Error("Estimated Blocks cannot be empty for order!");
      error.message = "Estimated Blocks cannot be empty for order!";
      error.statusCode = 400;
      throw error;
    } else if (req.body.quotedPrice === undefined) {
      const error = new Error("Quoted Price cannot be empty for order!");
      error.message = "Quoted Price cannot be empty for order!!";
      error.statusCode = 400;
      throw error;
    } else if (req.body.deliveryInstructions === undefined) {
      const error = new Error(
        "Delivery Instructions cannot be empty for order!"
      );
      error.message = "Delivery Instructions cannot be empty for order!!";
      error.statusCode = 400;
      throw error;
    }
    const id = req.params.id;
    await Order.update(req.body, {
      where: { id: id },
    })
      .then((number) => {
        if (number == 1) {
          res.send({
            status: "Success",
            message: "Order was updated successfully.",
            data: null,
          });
        } else {
          res.send({
            status: "Failure",
            message: `Cannot update Order with id = ${id}. Maybe Order was not found or req.body is empty!`,
            data: null,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          status: "Failure",
          message: err.message || "Error updating Order with id =" + id,
          data: null,
        });
      });
  } catch (e) {
    return res.status(500).send({
      status: "Failure",
      message: e.message,
      data: null,
    });
  }
};
// Update a Order by the id in the request
exports.updateAssigned = async (req, res) => {
  try {
    if (req.body.assignedTo === undefined) {
      const error = new Error("assignedTo cannot be empty for order!");
      error.message = "assignedTo cannot be empty for order!";
      error.statusCode = 400;
      throw error;
    }
    const id = req.params.id;
    req.body.statusId = 2;
    await Order.update(req.body, {
      where: { id: id },
    })
      .then((number) => {
        if (number == 1) {
          res.send({
            status: "Success",
            message: "Order assigned successfully.",
            data: null,
          });
        } else {
          res.send({
            status: "Failure",
            message: `Cannot update Order with id = ${id}. Maybe Order was not found or req.body is empty!`,
            data: null,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          status: "Failure",
          message: err.message || "Error updating Order with id =" + id,
          data: null,
        });
      });
  } catch (e) {
    return res.status(500).send({
      status: "Failure",
      message: e.message,
      data: null,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    if (req.body.statusId === undefined) {
      const error = new Error("statusId cannot be empty for order!");
      error.message = "statusId cannot be empty for order!";
      error.statusCode = 400;
      throw error;
    }
    const id = req.params.id;

    const currentOrder = await db.order.findOne({
      where: {
        id: id,
      },
    });

    const companyDetails = await db.companyInfo.findOne({});

    if (currentOrder.statusId == 3) {
      req.body.totalPrice = companyDetails.cancelCharges;
    } else {
      req.body.totalPrice = 0;
    }

    await Order.update(req.body, {
      where: { id: id },
    })
      .then((number) => {
        if (number == 1) {
          res.send({
            status: "Success",
            message: "Order status updated successfully.",
            data: null,
          });
        } else {
          res.send({
            status: "Failure",
            message: `Cannot update Order with id = ${id}. Maybe Order was not found or req.body is empty!`,
            data: null,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          status: "Failure",
          message: err.message || "Error updating Order with id =" + id,
          data: null,
        });
      });
  } catch (e) {
    return res.status(500).send({
      status: "Failure",
      message: e.message,
      data: null,
    });
  }
};

// Delete a Order with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Order.destroy({
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          status: "Success",
          message: "Order was deleted successfully!",
          data: null,
        });
      } else {
        res.send({
          status: "Failure",
          message: `Cannot delete Order with id = ${id}. Maybe Order was not found!`,
          data: null,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        status: "Failure",
        message: err.message || "Could not delete Order with id = " + id,
        data: null,
      });
    });
};
