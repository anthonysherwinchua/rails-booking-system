export interface BookingInterface {
  room: {
    name: string;
    maximum_capacity: number;
    tags: string[];
  };
  start_time: string;
  end_time: string;
  id: number;
}