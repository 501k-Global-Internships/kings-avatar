import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class ShareData extends Model {
  public id!: number;
  public imageUrl!: string;
  public userId!: number;
  public framesData!: object;
  public createdAt!: Date;

  static associate(models: any) {
    ShareData.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  }
}

ShareData.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    framesData: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ShareData',
  }
);

export default ShareData;
