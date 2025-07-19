import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/connection";

export interface ContactAttributes {
  id: bigint;
  phoneNumber: string | null;
  email: string | null;
  linkedId: bigint | null;
  linkPrecedence: "primary" | "secondary";
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface ContactCreationAttributes extends Optional<ContactAttributes, "id" | "linkedId" | "phoneNumber" | "email"> {}

class Contact extends Model<ContactAttributes, ContactCreationAttributes> implements ContactAttributes {
  public id!: bigint;
  public phoneNumber!: string | null;
  public email!: string | null;
  public linkedId!: bigint | null;
  public linkPrecedence!: "primary" | "secondary";

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

Contact.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedId: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    linkPrecedence: {
      type: DataTypes.ENUM("primary", "secondary"),
      defaultValue: "primary",
    },
  },
  {
    sequelize,
    modelName: "Contact",
    tableName: "Contact",
    paranoid: true, 
    timestamps: true,
  }
);

export default Contact;

// Associations
Contact.hasMany(Contact, { foreignKey: "linkedId", as: "secondaryContacts" })

