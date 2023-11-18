use dep::std;

global MAX_MOVES = 30; 
global SIZE = 4;
global INITIAL_POSITION = 15;

type Tile = u10;
type Move = u2;
type Position = u8;
type Moves = [Move; MAX_MOVES];
type State = [Tile; SIZE * SIZE];

fn main(moves: Moves, count_field: pub Field) {
    std::println(moves);
    let mut state: State = [2,1,3,4,5,6,7,8,9,10,11,12,13,15,14,0];
    let mut position: Position = INITIAL_POSITION;
    let bytes = count_field.to_le_bytes(32);
    let count = (bytes[0] as u16) + (bytes[1] as u16) * 256;

    for i in 0..MAX_MOVES {
        std::println(state);
        std::println(i);
        if (i < count) {
            let (new_position, new_state) = step(state, position, moves[i]);
            position = new_position;
            state = new_state;
        }
    }
    assert(position == 15, "invalid final");
    let end = (SIZE * SIZE) - 1;
    assert(0 == state[end], "invalid board");
    state.reduce(|a, b| {
        assert((b == 0) | (a < b), "invalid board");
        b 
    });
}

fn step(state: State, position: Position, movement: Move) -> (Position, State) {
    let new_position = move(position, movement);
    let swap = |t| {
        if (t == state[position]) {
            state[new_position]
        } else {
            if (t == state[new_position]) {
                state[position]
            } else {
                t
            }
        }
    };
    let new_state = state.map(swap);
    (new_position, new_state)
}

fn move(position: Position, movement: Move) -> Position {
    let x = position % SIZE;
    let y = position / SIZE;
    if (movement == 0) & (x < SIZE - 1) {
        y * SIZE + x + 1
    } else {
        if (movement == 1) & (y < SIZE - 1) {
            (y + 1) * SIZE + x
        } else {
            if (movement == 2) & (x > 0) {
                y * SIZE + x - 1
            } else {
                if (movement == 3) & (y > 0) {
                    (y - 1) * SIZE + x
                } else {
                    assert(false, "invalid move");
                    x
                }
            }
        }
    }
}

#[test]
fn test_main() {
    main([
        3, 2, 2, 1, 2, 3, 3, 3,
        0, 0, 1, 1, 2, 3, 2, 1,
        1, 0, 0, 3, 3, 3, 2, 1,
        1, 0, 0, 1, 0, 0,
        ]
        , 28);

    // Uncomment to make test fail
    // main(1, 1);
}
