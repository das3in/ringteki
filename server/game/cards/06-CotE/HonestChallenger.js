const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, CardTypes, DuelTypes } = require('../../Constants');

class HonestChallenger extends DrawCard {
    setupCardAbilities(ability) {
        this.composure({
            effect: ability.effects.modifyMilitarySkill(2)
        });

        this.action({
            title: 'Initiate a military duel',
            initiateDuel: context => ({
                type: DuelTypes.Military,
                gameAction: duel => duel.winner && AbilityDsl.actions.selectCard({
                    activePromptTitle: 'Choose a character to move to the conflict',
                    cardType: CardTypes.Character,
                    player: duel.winner === context.player ? Players.Self : Players.Opponent,
                    controller: duel.winner === context.player ? Players.Self : Players.Opponent,
                    gameAction: AbilityDsl.actions.moveToConflict()
                })
            })
        });
    }
    resolutionHandler(context, winner) {
        if(winner.controller.cardsInPlay.any(card => card.allowGameAction('moveToConflict', context))) {
            this.game.addMessage('{0} wins the duel', winner);
            this.game.promptForSelect(winner.controller, {
                activePromptTitle: 'Choose a character to move to the conflict',
                cardType: CardTypes.Character,
                cardCondition: card => card.allowGameAction('moveToConflict', context),
                controller: Players.Self,
                onSelect: (player, card) => {
                    this.game.addMessage('{0} moves {1} to the conflict', player, card);
                    this.game.applyGameAction(context, { moveToConflict: card });
                    return true;
                }
            });
        } else {
            this.game.addMessage('{0} wins the duel, but there are no valid targets for the duel effect', winner);
        }
    }
}

HonestChallenger.id = 'honest-challenger';

module.exports = HonestChallenger;
