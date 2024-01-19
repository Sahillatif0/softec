import requests
from bs4 import BeautifulSoup
import time

def scrape_organized_data():
    url = 'https://www.espn.in/football/fixtures?league=afc.asian.cup'

    headers = {'User-Agent': 'Mozilla/5.0'}  # Simplified for brevity

    for attempt in range(3):
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')

            desired_elements = soup.find_all(class_='ResponsiveTable')

            matches = []
            for element in desired_elements:
                match_data = {}
                lines = element.get_text(strip=True).splitlines()

                for line in lines:
                    if line.startswith("MATCH"):
                        match_data["date"] = line.split(",")[0].strip()
                        match_data["time"] = line.split(",")[1].strip()
                        match_data["tv"] = line.split(",")[2].strip()
                        match_data["teams"] = line.split(",")[-1].strip()
                    elif line.startswith("result"):
                        match_data["result"] = line.split(",")[1].strip()
                        match_data["location"] = line.split(",")[2].strip()
                        match_data["att"] = line.split(",")[3].strip()
                    else:
                        match_data["location"] = line.strip()

                matches.append(match_data)

            return matches

        else:
            print(f"Failed to retrieve data (attempt {attempt + 1}). Status code: {response.status_code}")
            time.sleep(5)

    return None

# Example usage
matches = scrape_organized_data()

if matches:
    print("Organized Matches:")
    for match in matches:
        print("Date:", match["date"])
        
        print("Time:", match["time"])
        print("TV:", match["tv"])
        print("Teams:", match["teams"])
        print("Result:", match["result"])
        print("Location:", match["location"])
        print("Attendance:", match["att"])
        print("-" * 20)
