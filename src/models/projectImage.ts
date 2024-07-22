import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class ProjectImage extends Model {
  public id!: number;
  public filename!: string;
  public url!: string; 
  public createdAt!: Date;
  public userId!: number;

  static associate(models: any) {
    ProjectImage.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  }
}

  ProjectImage.init(
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
      url: {
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
      modelName: 'ProjectImage',
    }
  );
export default ProjectImage;
