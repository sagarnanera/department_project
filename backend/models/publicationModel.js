const mongoose = require("mongoose");
const { PUBLICATION_TYPE } = require('../utils/constants');

const publicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        index: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    authors: [
        {
            type: String,
            required: true
        }
    ],
    publicationType: {
        type: String,
        enum: Object.values(PUBLICATION_TYPE),
        required: true
    },
    publicationDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value <= new Date();
            },
            message: "Publication date cannot be in the future."
        }
    },
    reports: [{
        title: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],

    // Attributes for journals
    publisher: {
        type: String,
        required: function () {
            return this.publicationType === PUBLICATION_TYPE.JOURNALS;
        },
    },
    volumeNo: {
        type: String,
        required: function () {
            return this.publicationType === PUBLICATION_TYPE.JOURNALS;
        },
    },
    issueNo: {
        type: String,
        required: function () {
            return this.publicationType === PUBLICATION_TYPE.JOURNALS;
        },
    },
    pageNoRange: {
        startPageNo: {
            type: Number,
            required: function () {
                return this.publicationType === PUBLICATION_TYPE.JOURNALS;
            },
        },
        endPageNo: {
            type: Number,
            required: function () {
                return this.publicationType === PUBLICATION_TYPE.JOURNALS;
            },
        },
    },

    // Attribute for conferences
    address: {
        city: {
            type: String,
            required: function () {
                return this.publicationType === PUBLICATION_TYPE.CONFERENCE;
            },
        },
        state: {
            type: String,
            required: function () {
                return this.publicationType === PUBLICATION_TYPE.CONFERENCE;
            },
        },
        country: {
            type: String,
            required: function () {
                return this.publicationType === PUBLICATION_TYPE.CONFERENCE;
            },
        },
        zip: {
            type: String,
            required: function () {
                return this.publicationType === PUBLICATION_TYPE.CONFERENCE;
            },
        },
    },
});

const publicationModel = mongoose.model("publications", publicationSchema);

module.exports = publicationModel;
