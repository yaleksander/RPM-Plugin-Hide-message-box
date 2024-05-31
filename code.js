import { RPM } from "../path.js"

const pluginName = "Hide message box";

var isHidden = false;

RPM.EventCommand.ShowText.prototype.action = function (currentState, isKey, options = {})
{
	if (RPM.Scene.MenuBase.checkActionMenu(isKey, options) && (isKey || (!isKey && this.windowMain.isInside(options.x, options.y))) && !isHidden)
		currentState.clicked = true;
}

function hideText()
{
	if (isHidden)
		return;
	for (var i = 0; i < RPM.Manager.Stack.top.reactionInterpreters.length; i++)
	{
		const c = RPM.Manager.Stack.top.reactionInterpreters[i].currentCommand;
		if (!c || c.data.constructor.name !== "ShowText" || (!!c.next && c.next.data.constructor.name === "DisplayChoice"))
			continue;
		const m = c.data.windowMain;
		c.prevMainWindow = [m.oX, m.oY, m.oH, m.oW];
		m.oX = -RPM.Datas.Systems.SQUARE_SIZE;
		m.oY = -RPM.Datas.Systems.SQUARE_SIZE;
		m.oH = 0;
		m.oW = 0;
		m.updateDimensions();
		const n = c.data.windowInterlocutor;
		c.prevNameWindow = [n.oX, n.oY, n.oH, n.oW];
		n.oX = -RPM.Datas.Systems.SQUARE_SIZE;
		n.oY = -RPM.Datas.Systems.SQUARE_SIZE;
		n.oH = 0;
		n.oW = 0;
		n.updateDimensions();
		isHidden = true;
	}
}

function showText()
{
	if (!isHidden)
		return;
	for (var i = 0; i < RPM.Manager.Stack.top.reactionInterpreters.length; i++)
	{
		const c = RPM.Manager.Stack.top.reactionInterpreters[i].currentCommand;
		if (!c || c.data.constructor.name !== "ShowText")
			continue;
		if (!!c.prevMainWindow)
		{
			const m = c.data.windowMain;
			m.oX = c.prevMainWindow[0];
			m.oY = c.prevMainWindow[1];
			m.oH = c.prevMainWindow[2];
			m.oW = c.prevMainWindow[3];
			m.updateDimensions();
		}
		if (c.prevNameWindow)
		{
			const n = c.data.windowInterlocutor;
			n.oX = c.prevNameWindow[0];
			n.oY = c.prevNameWindow[1];
			n.oH = c.prevNameWindow[2];
			n.oW = c.prevNameWindow[3];
			n.updateDimensions();
		}
		isHidden = false;
	}
}

RPM.Manager.Plugins.registerCommand(pluginName, "Hide text", () =>
{
	hideText();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Show text", () =>
{
	showText();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Is hidden?", (prop) =>
{
	RPM.Core.ReactionInterpreter.currentObject.properties[prop] = isHidden;
});

RPM.Manager.Plugins.registerCommand(pluginName, "Toggle text", () =>
{
	isHidden ? showText() : hideText();
});
