import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public recoveryPasswordId!: string;

  static associate(models: any) {
    User.hasMany(models.GalleryImage, {
      foreignKey: 'userId',
    });

    User.hasMany(models.ProjectImage, {
      foreignKey: 'userId',
    });
  }
}

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      recoveryPasswordId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

export default User;
