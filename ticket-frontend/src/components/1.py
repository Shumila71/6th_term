from org.bukkit import Bukkit
from org.bukkit import OfflinePlayer
from org.bukkit.scoreboard import Scoreboard, Team, ScoreboardManager
from org.bukkit import ChatColor
server = Bukkit.getServer() 
consoleSender = server.getConsoleSender() 
pl= Bukkit.getOfflinePlayer("Noise71")
pl1 = pl.getPlayer()


scoreboard = Bukkit.getScoreboardManager().getMainScoreboard()


if scoreboard.getTeam("customTeam") == None:
    scoreboard.registerNewTeam("customTeam")

t1=scoreboard.getTeam("customTeam")

#t1.setDisplayName(ChatColor.BLUE.toString() + "Noise71")
t1.setPrefix(u"§8[§4Куратор§8] ")
t1.addPlayer(pl1)
print (t1.getPlayers())


#player = Bukkit.getPlayer("Noise71") 
#pl1.setDisplayName("Nooooise71")

# print(ScoreboardManager.getMainScoreboard())
# print(pl1.getDisplayName())
#player.chat(u":)")




-----------------------


from org.bukkit import Bukkit
from org.bukkit import OfflinePlayer
from org.bukkit.scoreboard import Scoreboard, Team, ScoreboardManager
from org.bukkit import ChatColor
pl1 = Bukkit.getPlayer("Alpaka_Masha") 
if pl1.hasPermission("kits.kit.truemod"):
    print("123")
    
-----------------------
    
from org.bukkit import Bukkit
from org.bukkit import OfflinePlayer
from org.bukkit.scoreboard import Scoreboard, Team, ScoreboardManager, DisplaySlot
from org.bukkit import ChatColor
server = Bukkit.getServer() 
consoleSender = server.getConsoleSender() 
pl= Bukkit.getOfflinePlayer("Noise71")
pl1 = pl.getPlayer()

scoreboard = Bukkit.getScoreboardManager().getMainScoreboard()

tab_obj = scoreboard.getObjective("tabSort") or \
          scoreboard.registerNewObjective("tabSort", "dummy")
tab_obj.setDisplaySlot(DisplaySlot.PLAYER_LIST)
tab_obj.getScore("customTeam").setScore(10)

