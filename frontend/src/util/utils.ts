import fs from 'fs';
import clock from '../../public/clock.png';
import clock2 from '../../public/clock2.png';

export const mapIdToImage = (id: string) => {
  switch (id) {
    case '1':
      return clock;
    case '2':
      return clock2;
    default:
      return null;
  }
};
