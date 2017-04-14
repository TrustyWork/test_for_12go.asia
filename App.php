<?php

class Test
{
	private static $instance = null;
	private $data = null;

	/**
	 * @return Singleton
	 */
	public static function obj()
	{
		if (is_null(self::$instance)) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	public function run($input)
	{

		echo '<pre>';
		print_r($input);
		echo '</pre>';

		$this->input = $input;
		$this->data = $this->parse($input);

		return $this->data;

	}

	/**
	 * @return array $this->data
	 */
	public function getData()
	{
		if( is_null( $this->data)){
			throw new Error( 'First use "run"');
		}

		return $this->data;
	}

	/**
	 * @return array $this->data
	 */
	public function getBetweenEndPoints()
	{
		if( is_null( $this->data)){
			throw new Error( 'First use "run"');
		}

		foreach( $this->data as $testcase) {

		}

		return $result;
	}

	protected function parse($input)
	{

		//case separator
		$testcases = [];

		$rows = explode(PHP_EOL, $input);
		$offset = 1;
		foreach ($rows as $lenght) {

			if (!is_numeric($lenght) || $lenght == 0) {
				continue;
			}

			$testcases[] = array_slice($rows, $offset, $lenght);
			$offset += $lenght + 1;
		}

		//calculate endpoint
		foreach ($testcases as $idxTc => $testcase) {
			foreach ($testcase as $idxInst => $instructions) {

				$instructions = explode(' ', $instructions);
				$angle = 0;
				$name = '';

				$testcases[$idxTc][$idxInst] = [
					x => array_shift($instructions)
					, y => array_shift($instructions)
				];

				foreach ($instructions as $instruction) {

					if (!is_numeric($instruction)) {
						$name = $instruction;
						continue;
					}

					if (in_array($name, ['start', 'turn'])) {
						$angle += $instruction;
						/*
						 * Angles of area
						 *      ↑ N 90deg
						 *      |
						 * <====|====> E 0deg
						 *      |
						 *      ↓
						 */
						if ( $angle > 360 || $angle < -360) {
							$angle = $angle % 360;
						}

						if ( $angle < 0) {
							$angle = 360 + angle;
						}
						continue;
					}

					//walk
					/*
					 * See the theorem of Pythagoras
					 * ↑x  |\
					 * |   | \
					 * |   |  \ h (Hypotenuse) == $instruction
					 * |   |   \
					 * |   |____\ angleA
					 * |
					 * |===========> y
					 *
					 *        /|      |\        |"/A     A\"|
					 *   1. A/_|   2. |_\A   3. |/     4.  \|
					*/

					if( $angle <= 90) {
						$angleA = $angle;
					} elseif( $angle < 180) {
						$angleA = 180 - $angle;
					} elseif( $angle < 270) {
						$angleA = $angle - 180;
					} else {
						$angleA = 360 - $angle;
					}

					//cathetus
					$deltaX = $instruction * cos( deg2rad( $angleA));
					$deltaY = $instruction * sin( deg2rad( $angleA));

					if( $angle < 90) {

					} elseif( $angle < 180) {
						$deltaX = $deltaX * -1;
					} elseif( $angle < 270) {
						$deltaX = $deltaX * -1;
						$deltaY = $deltaY * -1;
					} else {
						$deltaY = $deltaY * -1;
					}

					$testcases[$idxTc][$idxInst][ 'x']+= $deltaX;
					$testcases[$idxTc][$idxInst][ 'y']+= $deltaY;
				}
			}
		}

		return $testcases;
	}
}

$input = "3
87.342 34.30 start 0 walk 10.0
2.6762 75.2811 start -45.0 walk 40 turn 40.0 walk 60
58.518 93.508 start 270 walk 50 turn 90 walk 40 turn 13 walk 5
2
30 40 start 90 walk 5
40 50 start 180 walk 10 turn 90 walk 5
0";

//echo Test::obj()->run( $input);
Test::obj()->run($input);

echo '<pre>';
print_r( Test::obj()->getData());
echo '</pre>';