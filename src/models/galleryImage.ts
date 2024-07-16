import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class GalleryImage extends Model {
  public id!: number;
  public filename!: string;
  public createdAt!: Date;
  public userId!: number;

  static associate(models: any) {
    GalleryImage.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  }
}

GalleryImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'GalleryImage',
  }
);

export default GalleryImage;
