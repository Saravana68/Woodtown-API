const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [ true, 'please provide product name' ],
			maxlength: [ 100, 'Name can not be more than 100 characters' ]
		},
		price: {
			type: Number,
			required: [ true, 'please provide product price' ],
			default: 0
		},
		description: {
			type: String,
			required: [ true, 'please provide product Description' ],
			maxlength: [ 1000, 'description can not be more than 1000 characters!' ]
		},
		image: {
			type: String,
			default: '/uploads/example.jpeg'
		},
		category: {
			type: String,
			required: [ true, 'please provide product category' ],
			enum: [ 'office', 'kitchen', 'bedroom' ]
		},
		company: {
			type: String,
			required: [ true, 'please provide company ' ],
			enum: {
				values: [ 'ikea', 'liddy', 'marcos' ],
				message: `{VALUE} is not supported`
			}
		},
		colors: {
			type: [ String ],
			required: [ true, 'please provide color' ]
		},
		featured: {
			type: Boolean,
			default: false
		},
		freeShipping: {
			type: Boolean,
			default: false
		},
		inventory: {
			type: Number,
			required: true,
			default: 15
		},
		numOfReviews: {
			type: Number,
			default : 0
		},
		averageRating: {
			type: Number,
			default: 0
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
		}
	},
	{
		timestamps: true,
		toJSON: { virtuals: true }, // step1 in creating virtual
		toObject :{virtuals: true} // step 2 in creating virtual
	}
);
productSchema.virtual('reviews', {
	ref: 'Review',
	localField: '_id',
	foreignField: 'product',
	justOne: false
});

productSchema.pre('remove', async function (next) {
	await this.model('Review').deleteMany({ product: this._id });
})

module.exports = mongoose.model('Product', productSchema);
