const clocktowers = {
  ClockTowers: [
    {
      Name: 'Clock Tower 1',
      Image: '1'
    },
    {
      Name: 'Clock Tower 2',
      Image: '2'
    }
  ]
};

// Function to get a random clock tower
export function getRandomClockTower() {
  const randomIndex = Math.floor(
    Math.random() * clocktowers.ClockTowers.length
  );
  return clocktowers.ClockTowers[randomIndex].Image;
}
