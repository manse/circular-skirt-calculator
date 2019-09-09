import React, { ChangeEvent, Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import './App.css';
import description from './description.svg';

type State = {
  radius: number;
  arcLength: number;
  height: number;
  size: number;
  d: string;
};

const SCALE = 100 / 35.278;

export default class App extends Component<{}, State> {
  public state = {
    radius: 50,
    arcLength: 100,
    height: 100,
    size: 0,
    d: ''
  };

  public componentDidMount() {
    this.calculate();
  }

  private handleChangeRadius = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ radius: Number(e.target.value) }, () => this.calculate());
  };

  private handleChangeArcLength = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ arcLength: Number(e.target.value) }, () =>
      this.calculate()
    );
  };

  private handleChangeHeight = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ height: Number(e.target.value) }, () => this.calculate());
  };

  private calculate() {
    const angle = this.state.arcLength / this.state.radius;
    const halfAngle = angle / 2;
    const r0 = this.state.radius * SCALE;
    const r1 = (this.state.radius + this.state.height) * SCALE;
    const dx0 = Math.sin(halfAngle) * r0;
    const dy0 = Math.cos(halfAngle) * r0;
    const dx1 = Math.sin(halfAngle) * r1;
    const dy1 = Math.cos(halfAngle) * r1;
    const offsetX = Math.max(dx1, dx0, r1);
    const offsetY = Math.max(-dy1, -dy0);
    const x0 = offsetX - dx0;
    const y0 = offsetY + dy0;
    const x1 = offsetX + dx0;
    const y1 = offsetY + dy0;
    const x2 = offsetX + dx1;
    const y2 = offsetY + dy1;
    const x3 = offsetX - dx1;
    const y3 = offsetY + dy1;

    this.setState({
      size: r1 * 2,
      d: [
        `M${[x0, y0].join(' ')}`,
        `A${[r0, r0, 0, angle > Math.PI ? 1 : 0, 0, x1, y1].join(' ')}`,
        `L${[x2, y2].join(' ')}`,
        `A${[r1, r1, 0, angle > Math.PI ? 1 : 0, 1, x3, y3].join(' ')}`,
        'Z'
      ].join(' ')
    });
  }

  public render() {
    return (
      <Fragment>
        <Helmet>
          <title>circular skirt calculator</title>
        </Helmet>
        <header>
          <table>
            <tbody>
              <tr>
                <td rowSpan={4}>
                  <img src={description} width={200} />
                </td>
                <th>Arc Length</th>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={this.state.arcLength}
                    onChange={this.handleChangeArcLength}
                  />
                  mm
                </td>
              </tr>
              <tr>
                <th>Height</th>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={this.state.height}
                    onChange={this.handleChangeHeight}
                  />
                  mm
                </td>
              </tr>
              <tr>
                <th>Radius</th>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={this.state.radius}
                    onChange={this.handleChangeRadius}
                  />
                  mm
                </td>
              </tr>
              <tr>
                <th>Output</th>
                <td>
                  <input
                    value={`<svg><path d="${this.state.d}" /></svg>`}
                    className="output"
                    size={100}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <hr />
          <svg
            width={this.state.size}
            height={this.state.size}
            viewBox={`0 0 ${this.state.size} ${this.state.size}`}
          >
            <path d={this.state.d} />
          </svg>
        </header>
      </Fragment>
    );
  }
}
