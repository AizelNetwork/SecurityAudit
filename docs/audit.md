**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
 - [arbitrary-send-eth](#arbitrary-send-eth) (1 results) (High)
 - [incorrect-exp](#incorrect-exp) (1 results) (High)
 - [unchecked-transfer](#unchecked-transfer) (3 results) (High)
 - [divide-before-multiply](#divide-before-multiply) (9 results) (Medium)
 - [unused-return](#unused-return) (1 results) (Medium)
 - [shadowing-local](#shadowing-local) (1 results) (Low)
 - [missing-zero-check](#missing-zero-check) (2 results) (Low)
 - [calls-loop](#calls-loop) (5 results) (Low)
 - [reentrancy-events](#reentrancy-events) (2 results) (Low)
 - [timestamp](#timestamp) (2 results) (Low)
 - [assembly](#assembly) (12 results) (Informational)
 - [pragma](#pragma) (1 results) (Informational)
 - [solc-version](#solc-version) (3 results) (Informational)
 - [missing-inheritance](#missing-inheritance) (1 results) (Informational)
 - [naming-convention](#naming-convention) (3 results) (Informational)
 - [reentrancy-unlimited-gas](#reentrancy-unlimited-gas) (2 results) (Informational)
 - [immutable-states](#immutable-states) (2 results) (Optimization)
## arbitrary-send-eth
Impact: High
Confidence: Medium
 - [ ] ID-0
[ZeroRoyalty.withdrawRemainder()](contracts/ZeroRoyalty.sol#L280-L297) sends eth to arbitrary user
	Dangerous calls:
	- [address(msg.sender).transfer(ethRemainder)](contracts/ZeroRoyalty.sol#L290)

contracts/ZeroRoyalty.sol#L280-L297


## incorrect-exp
Impact: High
Confidence: Medium
 - [ ] ID-1
[Math.mulDiv(uint256,uint256,uint256)](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L144-L223) has bitwise-xor operator ^ instead of the exponentiation operator **: 
	 - [inverse = (3 * denominator) ^ 2](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L205)

node_modules/@openzeppelin/contracts/utils/math/Math.sol#L144-L223


## unchecked-transfer
Impact: High
Confidence: Medium
 - [ ] ID-2
[ZeroRoyalty.claimReward(uint256)](contracts/ZeroRoyalty.sol#L255-L278) ignores return value by [IERC20(wethToken).transfer(msg.sender,wethReward)](contracts/ZeroRoyalty.sol#L274)

contracts/ZeroRoyalty.sol#L255-L278


 - [ ] ID-3
[ZeroRoyalty.withdrawRemainder()](contracts/ZeroRoyalty.sol#L280-L297) ignores return value by [IERC20(wethToken).transfer(msg.sender,wethRemainder)](contracts/ZeroRoyalty.sol#L294)

contracts/ZeroRoyalty.sol#L280-L297


 - [ ] ID-4
[ZeroRoyalty.withdrawOthers(address[])](contracts/ZeroRoyalty.sol#L299-L315) ignores return value by [IERC20(tokens[i]).transfer(msg.sender,tokenBalance)](contracts/ZeroRoyalty.sol#L312)

contracts/ZeroRoyalty.sol#L299-L315


## divide-before-multiply
Impact: Medium
Confidence: Medium
 - [ ] ID-5
[Math.mulDiv(uint256,uint256,uint256)](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L144-L223) performs a multiplication on the result of a division:
	- [denominator = denominator / twos](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L190)
	- [inverse *= 2 - denominator * inverse](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L211)

node_modules/@openzeppelin/contracts/utils/math/Math.sol#L144-L223


 - [ ] ID-6
[Math.invMod(uint256,uint256)](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L243-L289) performs a multiplication on the result of a division:
	- [quotient = gcd / remainder](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L265)
	- [(gcd,remainder) = (remainder,gcd - remainder * quotient)](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L267-L274)

node_modules/@openzeppelin/contracts/utils/math/Math.sol#L243-L289


 - [ ] ID-7
[Math.mulDiv(uint256,uint256,uint256)](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L144-L223) performs a multiplication on the result of a division:
	- [denominator = denominator / twos](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L190)
	- [inverse *= 2 - denominator * inverse](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L213)

node_modules/@openzeppelin/contracts/utils/math/Math.sol#L144-L223


 - [ ] ID-8
[Math.mulDiv(uint256,uint256,uint256)](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L144-L223) performs a multiplication on the result of a division:
	- [denominator = denominator / twos](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L190)
	- [inverse *= 2 - denominator * inverse](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L212)

node_modules/@openzeppelin/contracts/utils/math/Math.sol#L144-L223


 - [ ] ID-9
[Math.mulDiv(uint256,uint256,uint256)](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L144-L223) performs a multiplication on the result of a division:
	- [denominator = denominator / twos](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L190)
	- [inverse *= 2 - denominator * inverse](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L214)

node_modules/@openzeppelin/contracts/utils/math/Math.sol#L144-L223


 - [ ] ID-10
[Math.mulDiv(uint256,uint256,uint256)](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L144-L223) performs a multiplication on the result of a division:
	- [prod0 = prod0 / twos](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L193)
	- [result = prod0 * inverse](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L220)

node_modules/@openzeppelin/contracts/utils/math/Math.sol#L144-L223


 - [ ] ID-11
[Math.mulDiv(uint256,uint256,uint256)](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L144-L223) performs a multiplication on the result of a division:
	- [denominator = denominator / twos](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L190)
	- [inverse *= 2 - denominator * inverse](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L210)

node_modules/@openzeppelin/contracts/utils/math/Math.sol#L144-L223


 - [ ] ID-12
[Math.mulDiv(uint256,uint256,uint256)](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L144-L223) performs a multiplication on the result of a division:
	- [denominator = denominator / twos](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L190)
	- [inverse *= 2 - denominator * inverse](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L209)

node_modules/@openzeppelin/contracts/utils/math/Math.sol#L144-L223


 - [ ] ID-13
[Math.mulDiv(uint256,uint256,uint256)](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L144-L223) performs a multiplication on the result of a division:
	- [denominator = denominator / twos](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L190)
	- [inverse = (3 * denominator) ^ 2](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L205)

node_modules/@openzeppelin/contracts/utils/math/Math.sol#L144-L223


## unused-return
Impact: Medium
Confidence: Medium
 - [ ] ID-14
[ZeroRoyalty.addEventMemberships(string,uint256[])](contracts/ZeroRoyalty.sol#L180-L200) ignores return value by [eventRecord.memberships.add(tokenIds[i])](contracts/ZeroRoyalty.sol#L197)

contracts/ZeroRoyalty.sol#L180-L200


## shadowing-local
Impact: Low
Confidence: High
 - [ ] ID-15
[Zero.mint(address,string).tokenURI](contracts/Zero.sol#L37) shadows:
	- [ERC721URIStorage.tokenURI(uint256)](node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol#L34-L50) (function)
	- [ERC721.tokenURI(uint256)](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L88-L93) (function)
	- [IERC721Metadata.tokenURI(uint256)](node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol#L26) (function)

contracts/Zero.sol#L37


## missing-zero-check
Impact: Low
Confidence: Medium
 - [ ] ID-16
[ZeroRoyalty.constructor(address,address,uint256)._nftContract](contracts/ZeroRoyalty.sol#L82) lacks a zero-check on :
		- [nftContract = _nftContract](contracts/ZeroRoyalty.sol#L88)

contracts/ZeroRoyalty.sol#L82


 - [ ] ID-17
[ZeroRoyalty.constructor(address,address,uint256)._wethToken](contracts/ZeroRoyalty.sol#L81) lacks a zero-check on :
		- [wethToken = _wethToken](contracts/ZeroRoyalty.sol#L87)

contracts/ZeroRoyalty.sol#L81


## calls-loop
Impact: Low
Confidence: Medium
 - [ ] ID-18
[ZeroRoyalty.claimReward(uint256)](contracts/ZeroRoyalty.sol#L255-L278) has external calls inside a loop: [address(msg.sender).transfer(ethReward)](contracts/ZeroRoyalty.sol#L270)

contracts/ZeroRoyalty.sol#L255-L278


 - [ ] ID-19
[ZeroRoyalty.withdrawOthers(address[])](contracts/ZeroRoyalty.sol#L299-L315) has external calls inside a loop: [tokenBalance = IERC20(tokens[i]).balanceOf(address(this))](contracts/ZeroRoyalty.sol#L309)

contracts/ZeroRoyalty.sol#L299-L315


 - [ ] ID-20
[ZeroRoyalty.withdrawOthers(address[])](contracts/ZeroRoyalty.sol#L299-L315) has external calls inside a loop: [IERC20(tokens[i]).transfer(msg.sender,tokenBalance)](contracts/ZeroRoyalty.sol#L312)

contracts/ZeroRoyalty.sol#L299-L315


 - [ ] ID-21
[ZeroRoyalty.claimReward(uint256)](contracts/ZeroRoyalty.sol#L255-L278) has external calls inside a loop: [IERC20(wethToken).transfer(msg.sender,wethReward)](contracts/ZeroRoyalty.sol#L274)

contracts/ZeroRoyalty.sol#L255-L278


 - [ ] ID-22
[ZeroRoyalty.claimReward(uint256)](contracts/ZeroRoyalty.sol#L255-L278) has external calls inside a loop: [require(bool,string)(msg.sender == IERC721(nftContract).ownerOf(tokenId),ZeroRoyalty: not nft owner)](contracts/ZeroRoyalty.sol#L256-L259)

contracts/ZeroRoyalty.sol#L255-L278


## reentrancy-events
Impact: Low
Confidence: Medium
 - [ ] ID-23
Reentrancy in [ZeroRoyalty.withdrawRemainder()](contracts/ZeroRoyalty.sol#L280-L297):
	External calls:
	- [IERC20(wethToken).transfer(msg.sender,wethRemainder)](contracts/ZeroRoyalty.sol#L294)
	External calls sending eth:
	- [address(msg.sender).transfer(ethRemainder)](contracts/ZeroRoyalty.sol#L290)
	Event emitted after the call(s):
	- [RemainderWithdrawn(msg.sender,ethRemainder,wethRemainder)](contracts/ZeroRoyalty.sol#L296)

contracts/ZeroRoyalty.sol#L280-L297


 - [ ] ID-24
Reentrancy in [ZeroRoyalty.claimReward(uint256)](contracts/ZeroRoyalty.sol#L255-L278):
	External calls:
	- [IERC20(wethToken).transfer(msg.sender,wethReward)](contracts/ZeroRoyalty.sol#L274)
	External calls sending eth:
	- [address(msg.sender).transfer(ethReward)](contracts/ZeroRoyalty.sol#L270)
	Event emitted after the call(s):
	- [RewardClaimed(tokenId,msg.sender,ethReward,wethReward)](contracts/ZeroRoyalty.sol#L277)

contracts/ZeroRoyalty.sol#L255-L278


## timestamp
Impact: Low
Confidence: Medium
 - [ ] ID-25
[ZeroRoyalty.submitEventReward(string,uint256[])](contracts/ZeroRoyalty.sol#L202-L247) uses timestamp for comparisons
	Dangerous comparisons:
	- [require(bool,string)(eventRecord.status == 0,ZeroRoyalty: event already submitted or invalid)](contracts/ZeroRoyalty.sol#L214-L217)

contracts/ZeroRoyalty.sol#L202-L247


 - [ ] ID-26
[ZeroRoyalty.createEvent(string)](contracts/ZeroRoyalty.sol#L166-L178) uses timestamp for comparisons
	Dangerous comparisons:
	- [require(bool,string)(eventRecords[eventKey].createdTime == 0,ZeroRoyalty: event already exists)](contracts/ZeroRoyalty.sol#L171-L174)

contracts/ZeroRoyalty.sol#L166-L178


## assembly
Impact: Informational
Confidence: High
 - [ ] ID-27
[SafeCast.toUint(bool)](node_modules/@openzeppelin/contracts/utils/math/SafeCast.sol#L1157-L1161) uses assembly
	- [INLINE ASM](node_modules/@openzeppelin/contracts/utils/math/SafeCast.sol#L1158-L1160)

node_modules/@openzeppelin/contracts/utils/math/SafeCast.sol#L1157-L1161


 - [ ] ID-28
[Math.tryModExp(bytes,bytes,bytes)](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L377-L399) uses assembly
	- [INLINE ASM](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L389-L398)

node_modules/@openzeppelin/contracts/utils/math/Math.sol#L377-L399


 - [ ] ID-29
[Strings.toChecksumHexString(address)](node_modules/@openzeppelin/contracts/utils/Strings.sol#L103-L121) uses assembly
	- [INLINE ASM](node_modules/@openzeppelin/contracts/utils/Strings.sol#L108-L110)

node_modules/@openzeppelin/contracts/utils/Strings.sol#L103-L121


 - [ ] ID-30
[ERC721Utils.checkOnERC721Received(address,address,address,uint256,bytes)](node_modules/@openzeppelin/contracts/token/ERC721/utils/ERC721Utils.sol#L25-L49) uses assembly
	- [INLINE ASM](node_modules/@openzeppelin/contracts/token/ERC721/utils/ERC721Utils.sol#L43-L45)

node_modules/@openzeppelin/contracts/token/ERC721/utils/ERC721Utils.sol#L25-L49


 - [ ] ID-31
[EnumerableSet.values(EnumerableSet.UintSet)](node_modules/@openzeppelin/contracts/utils/structs/EnumerableSet.sol#L365-L374) uses assembly
	- [INLINE ASM](node_modules/@openzeppelin/contracts/utils/structs/EnumerableSet.sol#L369-L371)

node_modules/@openzeppelin/contracts/utils/structs/EnumerableSet.sol#L365-L374


 - [ ] ID-32
[Strings.toString(uint256)](node_modules/@openzeppelin/contracts/utils/Strings.sol#L37-L55) uses assembly
	- [INLINE ASM](node_modules/@openzeppelin/contracts/utils/Strings.sol#L42-L44)
	- [INLINE ASM](node_modules/@openzeppelin/contracts/utils/Strings.sol#L47-L49)

node_modules/@openzeppelin/contracts/utils/Strings.sol#L37-L55


 - [ ] ID-33
[Panic.panic(uint256)](node_modules/@openzeppelin/contracts/utils/Panic.sol#L50-L56) uses assembly
	- [INLINE ASM](node_modules/@openzeppelin/contracts/utils/Panic.sol#L51-L55)

node_modules/@openzeppelin/contracts/utils/Panic.sol#L50-L56


 - [ ] ID-34
[Math.tryModExp(uint256,uint256,uint256)](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L337-L361) uses assembly
	- [INLINE ASM](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L339-L360)

node_modules/@openzeppelin/contracts/utils/math/Math.sol#L337-L361


 - [ ] ID-35
[EnumerableSet.values(EnumerableSet.Bytes32Set)](node_modules/@openzeppelin/contracts/utils/structs/EnumerableSet.sol#L219-L228) uses assembly
	- [INLINE ASM](node_modules/@openzeppelin/contracts/utils/structs/EnumerableSet.sol#L223-L225)

node_modules/@openzeppelin/contracts/utils/structs/EnumerableSet.sol#L219-L228


 - [ ] ID-36
[Math.mulDiv(uint256,uint256,uint256)](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L144-L223) uses assembly
	- [INLINE ASM](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L151-L154)
	- [INLINE ASM](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L175-L182)
	- [INLINE ASM](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L188-L197)

node_modules/@openzeppelin/contracts/utils/math/Math.sol#L144-L223


 - [ ] ID-37
[EnumerableSet.values(EnumerableSet.AddressSet)](node_modules/@openzeppelin/contracts/utils/structs/EnumerableSet.sol#L292-L301) uses assembly
	- [INLINE ASM](node_modules/@openzeppelin/contracts/utils/structs/EnumerableSet.sol#L296-L298)

node_modules/@openzeppelin/contracts/utils/structs/EnumerableSet.sol#L292-L301


 - [ ] ID-38
[Strings._unsafeReadBytesOffset(bytes,uint256)](node_modules/@openzeppelin/contracts/utils/Strings.sol#L435-L440) uses assembly
	- [INLINE ASM](node_modules/@openzeppelin/contracts/utils/Strings.sol#L437-L439)

node_modules/@openzeppelin/contracts/utils/Strings.sol#L435-L440


## pragma
Impact: Informational
Confidence: High
 - [ ] ID-39
3 different versions of Solidity are used:
	- Version constraint ^0.8.4 is used by:
		-[^0.8.4](node_modules/@limitbreak/creator-token-contracts/contracts/access/OwnablePermissions.sol#L2)
		-[^0.8.4](node_modules/@limitbreak/creator-token-contracts/contracts/interfaces/ICreatorToken.sol#L2)
		-[^0.8.4](node_modules/@limitbreak/creator-token-contracts/contracts/interfaces/ICreatorTokenTransferValidator.sol#L2)
		-[^0.8.4](node_modules/@limitbreak/creator-token-contracts/contracts/interfaces/IEOARegistry.sol#L2)
		-[^0.8.4](node_modules/@limitbreak/creator-token-contracts/contracts/interfaces/ITransferSecurityRegistry.sol#L2)
		-[^0.8.4](node_modules/@limitbreak/creator-token-contracts/contracts/interfaces/ITransferValidator.sol#L2)
		-[^0.8.4](node_modules/@limitbreak/creator-token-contracts/contracts/utils/CreatorTokenBase.sol#L2)
		-[^0.8.4](node_modules/@limitbreak/creator-token-contracts/contracts/utils/TransferPolicy.sol#L2)
		-[^0.8.4](node_modules/@limitbreak/creator-token-contracts/contracts/utils/TransferValidation.sol#L2)
	- Version constraint ^0.8.20 is used by:
		-[^0.8.20](node_modules/@openzeppelin/contracts/access/AccessControl.sol#L4)
		-[^0.8.20](node_modules/@openzeppelin/contracts/access/IAccessControl.sol#L4)
		-[^0.8.20](node_modules/@openzeppelin/contracts/interfaces/IERC165.sol#L4)
		-[^0.8.20](node_modules/@openzeppelin/contracts/interfaces/IERC2981.sol#L4)
		-[^0.8.20](node_modules/@openzeppelin/contracts/interfaces/IERC4906.sol#L4)
		-[^0.8.20](node_modules/@openzeppelin/contracts/interfaces/IERC721.sol#L4)
		-[^0.8.20](node_modules/@openzeppelin/contracts/interfaces/draft-IERC6093.sol#L3)
		-[^0.8.20](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L4)
		-[^0.8.20](node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol#L4)
		-[^0.8.20](node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol#L4)
		-[^0.8.20](node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol#L4)
		-[^0.8.20](node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol#L4)
		-[^0.8.20](node_modules/@openzeppelin/contracts/token/ERC721/utils/ERC721Utils.sol#L4)
		-[^0.8.20](node_modules/@openzeppelin/contracts/token/common/ERC2981.sol#L4)
		-[^0.8.20](node_modules/@openzeppelin/contracts/utils/Context.sol#L4)
		-[^0.8.20](node_modules/@openzeppelin/contracts/utils/Panic.sol#L4)
		-[^0.8.20](node_modules/@openzeppelin/contracts/utils/Strings.sol#L4)
		-[^0.8.20](node_modules/@openzeppelin/contracts/utils/introspection/ERC165.sol#L4)
		-[^0.8.20](node_modules/@openzeppelin/contracts/utils/introspection/IERC165.sol#L4)
		-[^0.8.20](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L4)
		-[^0.8.20](node_modules/@openzeppelin/contracts/utils/math/SafeCast.sol#L5)
		-[^0.8.20](node_modules/@openzeppelin/contracts/utils/math/SignedMath.sol#L4)
		-[^0.8.20](node_modules/@openzeppelin/contracts/utils/structs/EnumerableSet.sol#L5)
		-[^0.8.20](contracts/Zero.sol#L2)
	- Version constraint ^0.8.0 is used by:
		-[^0.8.0](contracts/ZeroRoyalty.sol#L2)

node_modules/@limitbreak/creator-token-contracts/contracts/access/OwnablePermissions.sol#L2


## solc-version
Impact: Informational
Confidence: High
 - [ ] ID-40
Version constraint ^0.8.0 contains known severe issues (https://solidity.readthedocs.io/en/latest/bugs.html)
	- FullInlinerNonExpressionSplitArgumentEvaluationOrder
	- MissingSideEffectsOnSelectorAccess
	- AbiReencodingHeadOverflowWithStaticArrayCleanup
	- DirtyBytesArrayToStorage
	- DataLocationChangeInInternalOverride
	- NestedCalldataArrayAbiReencodingSizeValidation
	- SignedImmutables
	- ABIDecodeTwoDimensionalArrayMemory
	- KeccakCaching.
It is used by:
	- [^0.8.0](contracts/ZeroRoyalty.sol#L2)

contracts/ZeroRoyalty.sol#L2


 - [ ] ID-41
Version constraint ^0.8.20 contains known severe issues (https://solidity.readthedocs.io/en/latest/bugs.html)
	- VerbatimInvalidDeduplication
	- FullInlinerNonExpressionSplitArgumentEvaluationOrder
	- MissingSideEffectsOnSelectorAccess.
It is used by:
	- [^0.8.20](node_modules/@openzeppelin/contracts/access/AccessControl.sol#L4)
	- [^0.8.20](node_modules/@openzeppelin/contracts/access/IAccessControl.sol#L4)
	- [^0.8.20](node_modules/@openzeppelin/contracts/interfaces/IERC165.sol#L4)
	- [^0.8.20](node_modules/@openzeppelin/contracts/interfaces/IERC2981.sol#L4)
	- [^0.8.20](node_modules/@openzeppelin/contracts/interfaces/IERC4906.sol#L4)
	- [^0.8.20](node_modules/@openzeppelin/contracts/interfaces/IERC721.sol#L4)
	- [^0.8.20](node_modules/@openzeppelin/contracts/interfaces/draft-IERC6093.sol#L3)
	- [^0.8.20](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L4)
	- [^0.8.20](node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol#L4)
	- [^0.8.20](node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol#L4)
	- [^0.8.20](node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol#L4)
	- [^0.8.20](node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol#L4)
	- [^0.8.20](node_modules/@openzeppelin/contracts/token/ERC721/utils/ERC721Utils.sol#L4)
	- [^0.8.20](node_modules/@openzeppelin/contracts/token/common/ERC2981.sol#L4)
	- [^0.8.20](node_modules/@openzeppelin/contracts/utils/Context.sol#L4)
	- [^0.8.20](node_modules/@openzeppelin/contracts/utils/Panic.sol#L4)
	- [^0.8.20](node_modules/@openzeppelin/contracts/utils/Strings.sol#L4)
	- [^0.8.20](node_modules/@openzeppelin/contracts/utils/introspection/ERC165.sol#L4)
	- [^0.8.20](node_modules/@openzeppelin/contracts/utils/introspection/IERC165.sol#L4)
	- [^0.8.20](node_modules/@openzeppelin/contracts/utils/math/Math.sol#L4)
	- [^0.8.20](node_modules/@openzeppelin/contracts/utils/math/SafeCast.sol#L5)
	- [^0.8.20](node_modules/@openzeppelin/contracts/utils/math/SignedMath.sol#L4)
	- [^0.8.20](node_modules/@openzeppelin/contracts/utils/structs/EnumerableSet.sol#L5)
	- [^0.8.20](contracts/Zero.sol#L2)

node_modules/@openzeppelin/contracts/access/AccessControl.sol#L4


 - [ ] ID-42
Version constraint ^0.8.4 contains known severe issues (https://solidity.readthedocs.io/en/latest/bugs.html)
	- FullInlinerNonExpressionSplitArgumentEvaluationOrder
	- MissingSideEffectsOnSelectorAccess
	- AbiReencodingHeadOverflowWithStaticArrayCleanup
	- DirtyBytesArrayToStorage
	- DataLocationChangeInInternalOverride
	- NestedCalldataArrayAbiReencodingSizeValidation
	- SignedImmutables.
It is used by:
	- [^0.8.4](node_modules/@limitbreak/creator-token-contracts/contracts/access/OwnablePermissions.sol#L2)
	- [^0.8.4](node_modules/@limitbreak/creator-token-contracts/contracts/interfaces/ICreatorToken.sol#L2)
	- [^0.8.4](node_modules/@limitbreak/creator-token-contracts/contracts/interfaces/ICreatorTokenTransferValidator.sol#L2)
	- [^0.8.4](node_modules/@limitbreak/creator-token-contracts/contracts/interfaces/IEOARegistry.sol#L2)
	- [^0.8.4](node_modules/@limitbreak/creator-token-contracts/contracts/interfaces/ITransferSecurityRegistry.sol#L2)
	- [^0.8.4](node_modules/@limitbreak/creator-token-contracts/contracts/interfaces/ITransferValidator.sol#L2)
	- [^0.8.4](node_modules/@limitbreak/creator-token-contracts/contracts/utils/CreatorTokenBase.sol#L2)
	- [^0.8.4](node_modules/@limitbreak/creator-token-contracts/contracts/utils/TransferPolicy.sol#L2)
	- [^0.8.4](node_modules/@limitbreak/creator-token-contracts/contracts/utils/TransferValidation.sol#L2)

node_modules/@limitbreak/creator-token-contracts/contracts/access/OwnablePermissions.sol#L2


## missing-inheritance
Impact: Informational
Confidence: High
 - [ ] ID-43
[Zero](contracts/Zero.sol#L10-L162) should inherit from [IERC721](contracts/ZeroRoyalty.sol#L15-L22)

contracts/Zero.sol#L10-L162


## naming-convention
Impact: Informational
Confidence: High
 - [ ] ID-44
Parameter [ZeroRoyalty.setMembershipFee(uint256)._membershipFee](contracts/ZeroRoyalty.sol#L146) is not in mixedCase

contracts/ZeroRoyalty.sol#L146


 - [ ] ID-45
Parameter [ZeroRoyalty.setRewardPercent(uint256)._rewardPercent](contracts/ZeroRoyalty.sol#L139) is not in mixedCase

contracts/ZeroRoyalty.sol#L139


 - [ ] ID-46
Parameter [ZeroRoyalty.setMaxWinners(uint256)._maxWinners](contracts/ZeroRoyalty.sol#L154) is not in mixedCase

contracts/ZeroRoyalty.sol#L154


## reentrancy-unlimited-gas
Impact: Informational
Confidence: Medium
 - [ ] ID-47
Reentrancy in [ZeroRoyalty.withdrawRemainder()](contracts/ZeroRoyalty.sol#L280-L297):
	External calls:
	- [address(msg.sender).transfer(ethRemainder)](contracts/ZeroRoyalty.sol#L290)
	Event emitted after the call(s):
	- [RemainderWithdrawn(msg.sender,ethRemainder,wethRemainder)](contracts/ZeroRoyalty.sol#L296)

contracts/ZeroRoyalty.sol#L280-L297


 - [ ] ID-48
Reentrancy in [ZeroRoyalty.claimReward(uint256)](contracts/ZeroRoyalty.sol#L255-L278):
	External calls:
	- [address(msg.sender).transfer(ethReward)](contracts/ZeroRoyalty.sol#L270)
	Event emitted after the call(s):
	- [RewardClaimed(tokenId,msg.sender,ethReward,wethReward)](contracts/ZeroRoyalty.sol#L277)

contracts/ZeroRoyalty.sol#L255-L278


## immutable-states
Impact: Optimization
Confidence: High
 - [ ] ID-49
[ZeroRoyalty.wethToken](contracts/ZeroRoyalty.sol#L29) should be immutable 

contracts/ZeroRoyalty.sol#L29


 - [ ] ID-50
[ZeroRoyalty.nftContract](contracts/ZeroRoyalty.sol#L30) should be immutable 

contracts/ZeroRoyalty.sol#L30


