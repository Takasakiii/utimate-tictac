import PlayerType from "../enums/player-type";

function formatPlayerType(player: unknown): string {
  switch (player) {
    case PlayerType.Circle: {
      return '⭕';
    }
    case PlayerType.Cross: {
      return '❎';
    }
    case PlayerType.CrossCircle: {
      return '❓';
    }
    default: {
      return '';
    }
  }
}

export default formatPlayerType;
