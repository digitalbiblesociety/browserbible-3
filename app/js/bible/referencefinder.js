bible.ReferenceFinder = (function() {
	
	function find(text) {
		var refs = [],
			lastRef = null,
			parts = text.split(';');
			
		console.log('PARSE', text);
			
		for (var i=0, il=parts.length; i<il; i++) {
			var part = parts[i],
				subParts = part.split(',');

			for (var j=0, jl=subParts.length; j<jl; j++) {
				var subPart = subParts[j],
					ref = null;
					
				//console.log(subPart); 
					
				subPart = subPart
								.replace(/\s$/, '')
								.replace(/^\s/, '');				
				
				//while (subPart.substring(0,1) == ' ') {
				//	subPart = subPart.substr(1);
				//}
				
				// 1 verse string
				if (/^\d+$/.test(subPart)) {
					ref = new bible.Reference(lastRef.bookid, lastRef.chapter1, lastRef.verse1, lastRef.chapter2, lastRef.verse2);
					ref.verse = ref.verse1 = parseInt(subPart, 10);
				} 
				// 1:1 chapter:verse
				else if (/^\d+:\d+$/.test(subPart)) {
					ref = new bible.Reference(lastRef.bookid, lastRef.chapter1, lastRef.verse1, lastRef.chapter2, lastRef.verse2);
					
					var miniParts = subPart.split(':'),	
						chapter = parseInt(miniParts[0],10),
						verse = parseInt(miniParts[1],10);						
					
					
					ref.chapter = ref.chapter1 = chapter;
					ref.verse = ref.verse1 = verse;					
				} 
				// 1-2 verse-verse
				else if (/^\d+-\d+$/.test(subPart)) {
					ref = new bible.Reference(lastRef.bookid, lastRef.chapter1, lastRef.verse1, lastRef.chapter2, lastRef.verse2);
					
					var miniParts = subPart.split('-'),	
						verse1 = parseInt(miniParts[0],10),
						verse2 = parseInt(miniParts[1],10);					
										
					ref.verse = ref.verse1 = verse1;					
					ref.verse2 = verse2;					
				} 
				// full text
				else {
					
					ref = new bible.Reference(subPart);
				}
					
				console.log(subPart, ref.toString());
				
				refs.push( ref );
				lastRef = ref;				
			}
			
		}
		
		return refs;
		
	}
	
	
	
	return {
		find: find
	}
	
})();