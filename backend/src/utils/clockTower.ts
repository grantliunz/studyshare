const clocktowers = {
  ClockTowers: [
    {
      Name: 'Clock Tower 1',
      Image:
        'https://cdn.discordapp.com/attachments/1013281488940322900/1231943183416557669/clock.png?ex=6627a7ff&is=6626567f&hm=e96b86250f787898f800ae54bf36a6bd2923a96d38495e3e89f93936e044c507&'
    },
    {
      Name: 'Clock Tower 2',
      Image:
        'https://cdn.discordapp.com/attachments/1013281488940322900/1231943183764557874/clock2.png?ex=6638cb7f&is=6626567f&hm=f7601f1f78b61943b7be022f9d9fcba8514a0797265efa96869a41370071f7e7&'
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
