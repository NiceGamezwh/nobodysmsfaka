// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MemberCardQueue
 * @notice 卡密队列合约（一次取出、管理员上库存）
 * 卡密格式示例（合约按完整字符串存储，不解析分隔符）：
 * API账号----API密码---安全密码
 * e.g. d8f87f…----37395f…---x0fahGpF1cR13S
 *
 * 核心逻辑：队列 + 只能取一次。
 */
contract MemberCardQueue is Ownable, ReentrancyGuard {
    // 完整卡密字符串数组
    string[] private cards;

    // 下一个要取出的索引
    uint256 public nextIndex;

    // 已使用标记（双重保险）
    mapping(uint256 => bool) public isUsed;

    // 事件
    event CardsAdded(uint256 startIndex, uint256 count);
    event CardTaken(uint256 indexed index, string card);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice 批量上新卡密（仅 Owner）
     * @param newCards 完整卡密字符串数组
     */
    function addCards(string[] calldata newCards) external onlyOwner {
        require(newCards.length > 0, "Empty cards");

        uint256 start = cards.length;
        for (uint256 i = 0; i < newCards.length; i++) {
            require(bytes(newCards[i]).length > 0, "Empty card string");
            cards.push(newCards[i]);
        }

        emit CardsAdded(start, newCards.length);
    }

    /**
     * @notice 取出下一个未使用的卡密（仅 Owner）
     * @return card 完整卡密字符串
     */
    function getNextCard() external onlyOwner nonReentrant returns (string memory) {
        require(nextIndex < cards.length, "No more cards available");

        uint256 index = nextIndex;
        require(!isUsed[index], "Card already used");

        isUsed[index] = true;
        nextIndex++;

        string memory card = cards[index];
        emit CardTaken(index, card);
        return card;
    }

    /**
     * @notice 查询剩余可用卡密数量
     */
    function remaining() external view returns (uint256) {
        return cards.length > nextIndex ? cards.length - nextIndex : 0;
    }

    /**
     * @notice 查询总上新数量
     */
    function total() external view returns (uint256) {
        return cards.length;
    }

    /**
     * @notice 查询指定索引的卡密是否已使用（公开可查）
     */
    function isCardUsed(uint256 index) external view returns (bool) {
        return isUsed[index];
    }

    /**
     * @notice 紧急情况：Owner 可强制跳过某个索引（慎用）
     * @dev 不会自动推进 nextIndex，需要手动处理
     */
    function skipCard(uint256 index) external onlyOwner {
        require(index < cards.length, "Invalid index");
        require(!isUsed[index], "Already used");
        isUsed[index] = true;
    }
}
