import React from 'react';
import PropTypes from 'prop-types';
import Clock from './Clock.jsx';

export class PlayerStatsBox extends React.Component {
    constructor() {
        super();

        this.sendUpdate = this.sendUpdate.bind(this);
    }

    sendUpdate(type, direction) {
        this.props.sendGameMessage('changeStat', type, direction === 'up' ? 1 : -1);
    }

    getStatValueOrDefault(stat) {
        if(!this.props.stats) {
            return 0;
        }

        return this.props.stats[stat] || 0;
    }

    getButton(stat, name, statToSet = stat) {
        const imageStyle = { backgroundImage: `url(/img/${name}.png)` };

        return (
            <div className='state'>
                {
                    this.props.showControls &&
                    <button className='btn btn-stat' onClick={ this.sendUpdate.bind(this, statToSet, 'down') }>
                        <img src='/img/Minus.png' title='-' alt='-' />
                    </button>
                }
                <div className='stat-image' style={ imageStyle } />
                <div>:</div>
                <div className='stat-value'>{ this.getStatValueOrDefault(stat) }</div>
                {
                    this.props.showControls &&
                    <button className='btn btn-stat' onClick={ this.sendUpdate.bind(this, statToSet, 'up') }>
                        <img src='/img/Plus.png' title='+' alt='+' />
                    </button>
                }
            </div>
        );
    }

    render() {
        let clock = (!this.props.clockState || this.props.clockState.mode === 'off') ? null : (
            <div className='state'>
                <Clock secondsLeft={ this.props.clockState.timeLeft } mode={ this.props.clockState.mode } stateId={ this.props.clockState.stateId } />
            </div>
        );

        return (
            <div className={ 'player-stats' + (this.props.otherPlayer ? '' : ' our-side') } >
                <div className='stats-row'>
                    {
                        <div className='state first-player-state'>
                            <img className={ 'first-player-indicator' + (this.props.firstPlayer ? '' : ' hidden') } src='/img/first-player.png' title='First Player' />
                        </div>
                    }
                </div>
                <div className='stats-row'>
                    { clock }
                </div>
                <div className='stats-row'>
                    <div className='state'>
                        <div className='conflicts-remaining'>
                            Conflicts: { this.getStatValueOrDefault('conflictsRemaining') }
                            <div>
                                { this.getStatValueOrDefault('politicalRemaining') > 0 ? <span className='icon-political'/> : null }
                                { this.getStatValueOrDefault('politicalRemaining') > 1 ? <span className='icon-political'/> : null }
                                { this.getStatValueOrDefault('militaryRemaining') > 0 ? <span className='icon-military'/> : null }
                                { this.getStatValueOrDefault('militaryRemaining') > 1 ? <span className='icon-military'/> : null }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='stats-row'>
                    <div className='state'>
                        <div className='hand-size'>Hand Size: { this.props.handSize }</div>
                    </div>
                </div>
                <div className='stats-row'>
                    { this.getButton('fate', 'Fate') }
                </div>
                <div className='stats-row'>
                    { this.getButton('honor', 'Honor') }
                </div>
            </div>
        );
    }
}

PlayerStatsBox.displayName = 'PlayerStatsBox';
PlayerStatsBox.propTypes = {
    clockState: PropTypes.object,
    firstPlayer: PropTypes.bool,
    handSize: PropTypes.number,
    otherPlayer: PropTypes.bool,
    sendGameMessage: PropTypes.func,
    showControls: PropTypes.bool,
    spectating: PropTypes.bool,
    stats: PropTypes.object,
    user: PropTypes.object
};

export default PlayerStatsBox;
