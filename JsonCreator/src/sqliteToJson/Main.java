package sqliteToJson;

import java.util.List;
import java.util.ArrayList;

public class Main {
	public static void main(String[] args) {

		DataFiller df = new DataFiller();

		List<Integer> pubIdList = df.pubIdList();
		List<PubMarker> pubMarkerList = new ArrayList<PubMarker>();

		for (int i = 0; i < pubIdList.size(); i++) {
			PubMarker marker = new PubMarker();
			df.fillAllData(marker, pubIdList.get(i));
			pubMarkerList.add(marker);
		}

		for (int i = 0; i < pubMarkerList.size(); i++) {
			System.out.println(pubMarkerList.get(i).toString());
		}

		JsonWriter jw = new JsonWriter();
		jw.write(pubMarkerList);
	}
}