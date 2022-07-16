export interface GameProps {
  colors: string[];
  speed: {
    s: number;
    m: number;
    l: number;
  };
  size: {
    s: {
      min: number;
      max: number;
    };
    m: {
      min: number;
      max: number;
    };
    l: {
      min: number;
      max: number;
    };
  };
  time: {
    s: number;
    m: number;
    l: number;
  };
  targets: {
    s: {
      min: number;
      max: number;
    };
    m: {
      min: number;
      max: number;
    };
    l: {
      min: number;
      max: number;
    };
  };
  figures: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    [key: number]: string;
  };
  blink: number;
}
