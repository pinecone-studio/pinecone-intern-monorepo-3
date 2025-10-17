import { IPostDocument } from '../post';
import { PropertyStatus } from '../../types';

// Instance methods for Post document
export const postMethods = {
  // Update status
  async updateStatus(this: IPostDocument, status: PropertyStatus): Promise<void> {
    this.status = status;
    await this.save();
  }
};