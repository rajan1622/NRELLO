import {Schema, model, Document} from 'mongoose'
import { generateHash } from '../../utils/hash';
import bcrypty from 'bcryptjs';

export interface UserDocument extends Document {
    name: string;
    email: string;
    password: string;
//     stripeCustomerId?: string;
//     subscription: {
//       id: string;
//       status: string;
//       priceId: string;
//     };
//     hasActiveSubscription: boolean;
//     comparePassword: (password: string) => Promise<boolean>;
//     updateSubscription: (data: Stripe.Subscription) => Promise<void>;
   }

const userSchema = new Schema(
    {
      name: {
        type: String,
        required: [true, "Name is required"],
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"],
      },
      password: {
        type: String,
        required: [true, "Password is required"],
      },
      stripeCustomerId: {
        type: String,
        default: null,
      },
      subscription: {
        id: {
          type: String,
          default: null,
        },
        status: {
          type: String,
          default: null,
        },
        priceId: {
          type: String,
          default: null,
        },
      },
    },
    {
      timestamps: true,
      toJSON: {
        virtuals: true,
      },
    }
  );

  userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
  
    this.password = await generateHash(this.password);
  
    next();
  });

  userSchema.methods.comparePassword = async function (password: string) {
    return await bcrypty.compare(password, this.password);
  };

  export const User = model<UserDocument>("User", userSchema);
  let m = 10;